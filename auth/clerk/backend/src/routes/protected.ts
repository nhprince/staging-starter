/**
 * Example protected routes for Clerk auth
 * Copy this file into your backend/src/routes/ directory
 */

import { Hono } from "hono";

const protectedRoutes = new Hono();

// Get current user profile
protectedRoutes.get("/api/protected/profile", (c) => {
  const user = c.get("user");
  return c.json({
    authenticated: true,
    user: {
      id: user?.id,
      email: user?.email,
      name: user?.name,
    },
  });
});

// Example: Protected data endpoint
protectedRoutes.get("/api/protected/data", (c) => {
  const user = c.get("user");
  return c.json({
    message: `Hello ${user?.email || "user"}!`,
    data: {
      items: ["item1", "item2", "item3"],
      timestamp: new Date().toISOString(),
    },
  });
});

// Example: Protected POST endpoint
protectedRoutes.post("/api/protected/action", async (c) => {
  const user = c.get("user");
  const body = await c.req.json();

  return c.json({
    success: true,
    message: `Action performed by ${user?.email}`,
    received: body,
  });
});

export default protectedRoutes;
