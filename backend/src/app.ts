import dotenv from "dotenv";
import cors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import Fastify from "fastify";
import { authController } from "./controllers/authController.js";
import { linksController } from "./controllers/linksController.js";
import { themeController } from "./controllers/themeController.js";
import { analyticsController } from "./controllers/analyticsController.js";
import { clickController } from "./controllers/clickController.js";
import { profileController } from "./controllers/profileController.js";

dotenv.config();

export function buildApp() {
  const app = Fastify({ logger: false });

  app.register(cors, {
    origin: process.env.FRONTEND_URL || "https://zk-linkhub.vercel.app"
  });
  app.register(fastifyJwt, { secret: process.env.JWT_SECRET || "dev-secret" });

  app.get("/health", async () => ({ ok: true }));
  app.register(authController, { prefix: "/auth" });
  app.register(linksController, { prefix: "/links" });
  app.register(themeController, { prefix: "/theme" });
  app.register(analyticsController, { prefix: "/analytics" });
  app.register(clickController, { prefix: "/click" });
  app.register(profileController, { prefix: "/profile" });

  return app;
}
