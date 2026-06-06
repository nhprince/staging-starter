import { Hono } from "hono";

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export const emailRouter = new Hono<{ Bindings: { RESEND_API_KEY: string; EMAIL_FROM: string } }>();

// Send a transactional email
emailRouter.post("/send", async (c) => {
  const body = await c.req.json<EmailRequest>();
  const apiKey = c.env.RESEND_API_KEY;
  const from = body.from || c.env.EMAIL_FROM || "noreply@saturday.dev";

  if (!body.to || !body.subject || !body.html) {
    return c.json({ error: "to, subject, and html are required" }, 400);
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: body.to,
        subject: body.subject,
        html: body.html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Resend error:", error);
      return c.json({ error: "Failed to send email" }, 500);
    }

    const data = await response.json();
    return c.json({ success: true, id: data.id });
  } catch (err: any) {
    console.error("Email send error:", err);
    return c.json({ error: "Internal error" }, 500);
  }
});

// Send welcome email
emailRouter.post("/welcome", async (c) => {
  const body = await c.req.json<{ to: string; name?: string }>();
  const apiKey = c.env.RESEND_API_KEY;
  const from = c.env.EMAIL_FROM || "noreply@saturday.dev";

  if (!body.to) {
    return c.json({ error: "to is required" }, 400);
  }

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <h1 style="color: #6366f1;">Welcome to Saturday! ✦</h1>
      <p>Hi ${body.name || "there"},</p>
      <p>Thanks for joining Saturday Framework. We're excited to have you!</p>
      <p>Get started by checking out the <a href="https://github.com/nhprince/saturday">documentation</a>.</p>
      <p>— The Saturday Team</p>
    </div>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: body.to, subject: "Welcome to Saturday! ✦", html }),
    });

    if (!response.ok) {
      return c.json({ error: "Failed to send welcome email" }, 500);
    }

    return c.json({ success: true });
  } catch {
    return c.json({ error: "Internal error" }, 500);
  }
});

// Send notification
emailRouter.post("/notify", async (c) => {
  const body = await c.req.json<{ to: string; title: string; message: string }>();
  const apiKey = c.env.RESEND_API_KEY;
  const from = c.env.EMAIL_FROM || "noreply@saturday.dev";

  if (!body.to || !body.title || !body.message) {
    return c.json({ error: "to, title, and message are required" }, 400);
  }

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <h2 style="color: #6366f1;">${body.title}</h2>
      <p>${body.message}</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="color: #888; font-size: 12px;">Sent via Saturday Framework</p>
    </div>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: body.to, subject: body.title, html }),
    });

    if (!response.ok) {
      return c.json({ error: "Failed to send notification" }, 500);
    }

    return c.json({ success: true });
  } catch {
    return c.json({ error: "Internal error" }, 500);
  }
});
