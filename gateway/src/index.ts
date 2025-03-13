import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { registerRoutes } from "./routes.ts";
import { errorMiddleware, requestIdMiddleware, loggingMiddleware } from "./middleware.ts";

const app = new Hono();

// Middleware
app.use(cors());
app.use(requestIdMiddleware);
app.use(errorMiddleware);
app.use(loggingMiddleware);

// Routes
registerRoutes(app);

// Error handling
app.notFound((c) => c.json({ message: "Not Found" }, 404));
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ message: "Internal Server Error" }, 500);
});

const port = Number.parseInt(process.env.PORT || "3080");
console.log(`Gateway listening on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
