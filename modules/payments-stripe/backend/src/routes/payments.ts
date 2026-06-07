import { Hono } from "hono";
import { z } from "zod";

const CreateCheckoutSchema = z.object({
  price_id: z.string().min(1),
  customer_email: z.string().email().optional(),
  success_url: z.string().url(),
  cancel_url: z.string().url(),
  metadata: z.record(z.string()).optional(),
});

export function paymentsRouter() {
  const app = new Hono<{ Bindings: { DB: D1Database; STRIPE_SECRET_KEY: string; STRIPE_WEBHOOK_SECRET?: string } }>();

  // Create checkout session
  app.post("/checkout", async (c) => {
    const secretKey = c.env.STRIPE_SECRET_KEY;
    if (!secretKey) return c.json({ error: "Stripe not configured" }, 500);

    try {
      const body = await c.req.json();
      const parsed = CreateCheckoutSchema.parse(body);

      const formData = new URLSearchParams();
      formData.append("mode", "payment");
      formData.append("line_items[0][price]", parsed.price_id);
      formData.append("line_items[0][quantity]", "1");
      formData.append("success_url", parsed.success_url);
      formData.append("cancel_url", parsed.cancel_url);
      if (parsed.customer_email) formData.append("customer_email", parsed.customer_email);
      if (parsed.metadata) {
        for (const [k, v] of Object.entries(parsed.metadata)) {
          formData.append(`metadata[${k}]`, v);
        }
      }

      const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${secretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        const err = await response.json() as any;
        return c.json({ error: err.error?.message ?? "Stripe error" }, 400);
      }

      const session = await response.json() as any;
      return c.json({
        id: session.id,
        url: session.url,
        status: session.status,
      });
    } catch (err: any) {
      if (err.name === "ZodError") {
        return c.json({ error: "Validation failed", details: err.errors }, 400);
      }
      return c.json({ error: err.message ?? "Checkout failed" }, 500);
    }
  });

  // Create subscription checkout
  app.post("/subscribe", async (c) => {
    const secretKey = c.env.STRIPE_SECRET_KEY;
    if (!secretKey) return c.json({ error: "Stripe not configured" }, 500);

    try {
      const body = await c.req.json();
      const parsed = CreateCheckoutSchema.parse(body);

      const formData = new URLSearchParams();
      formData.append("mode", "subscription");
      formData.append("line_items[0][price]", parsed.price_id);
      formData.append("line_items[0][quantity]", "1");
      formData.append("success_url", parsed.success_url);
      formData.append("cancel_url", parsed.cancel_url);
      if (parsed.customer_email) formData.append("customer_email", parsed.customer_email);

      const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${secretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        const err = await response.json() as any;
        return c.json({ error: err.error?.message ?? "Stripe error" }, 400);
      }

      const session = await response.json() as any;
      return c.json({ id: session.id, url: session.url });
    } catch (err: any) {
      if (err.name === "ZodError") {
        return c.json({ error: "Validation failed", details: err.errors }, 400);
      }
      return c.json({ error: err.message ?? "Subscription failed" }, 500);
    }
  });

  // Get checkout session status
  app.get("/session/:id", async (c) => {
    const secretKey = c.env.STRIPE_SECRET_KEY;
    const sessionId = c.req.param("id");

    const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
      headers: { "Authorization": `Bearer ${secretKey}` },
    });

    if (!response.ok) return c.json({ error: "Session not found" }, 404);
    const session = await response.json() as any;
    return c.json({
      id: session.id,
      status: session.status,
      payment_status: session.payment_status,
      customer_email: session.customer_details?.email,
      amount_total: session.amount_total,
      currency: session.currency,
    });
  });

  // Stripe webhook handler
  app.post("/webhook", async (c) => {
    const secretKey = c.env.STRIPE_SECRET_KEY;
    const webhookSecret = c.env.STRIPE_WEBHOOK_SECRET;
    const db = c.env.DB;

    const body = await c.req.text();
    const sig = c.req.header("stripe-signature");

    if (!sig || !webhookSecret) {
      return c.json({ error: "Missing signature" }, 400);
    }

    // Verify webhook signature
    try {
      const response = await fetch("https://api.stripe.com/v1/webhooks/verify", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload: body, signature: sig, secret: webhookSecret }),
      });
      if (!response.ok) return c.json({ error: "Invalid signature" }, 400);
    } catch {
      return c.json({ error: "Signature verification failed" }, 400);
    }

    const event = JSON.parse(body);
    const now = new Date().toISOString();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        await db.prepare(
          "INSERT OR REPLACE INTO subscriptions (id, stripe_customer_id, stripe_subscription_id, status, plan, email, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(
          session.id,
          session.customer,
          session.subscription,
          "active",
          session.metadata?.plan || "unknown",
          session.customer_details?.email || "",
          now, now
        ).run();
        break;
      }
      case "customer.subscription.updated": {
        const sub = event.data.object;
        await db.prepare(
          "UPDATE subscriptions SET status = ?, updated_at = ? WHERE stripe_subscription_id = ?"
        ).bind(sub.status, now, sub.id).run();
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        await db.prepare(
          "UPDATE subscriptions SET status = 'canceled', updated_at = ? WHERE stripe_subscription_id = ?"
        ).bind(now, sub.id).run();
        break;
      }
    }

    return c.json({ received: true });
  });

  // List subscriptions (admin)
  app.get("/subscriptions", async (c) => {
    const db = c.env.DB;
    const { results } = await db.prepare(
      "SELECT * FROM subscriptions ORDER BY created_at DESC LIMIT 100"
    ).all();
    return c.json({ subscriptions: results ?? [] });
  });

  return app;
}
