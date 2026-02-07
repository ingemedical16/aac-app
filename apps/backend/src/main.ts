import "reflect-metadata";
import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
import type { CorsOptions } from "cors";

function normalizeOrigin(origin: string) {
  return origin.replace(/\/$/, "");
}

function buildAllowedOrigins(): Set<string> {
  const fromEnv = (process.env.CORS_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map(normalizeOrigin);

  const defaults = [
    "http://localhost:3000",
    "https://ubiquitous-zebra-wv7ggxpwp5frrv-3000.app.github.dev",
    "https://aac-app-frontend.vercel.app",
    "https://aacboard.work",
    "https://staging.aacboard.work",
    "https://dev.aacboard.work",
  ].map(normalizeOrigin);

  return new Set([...defaults, ...fromEnv]);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cookies (required for HttpOnly auth cookie + middleware-friendly auth)
  app.use(cookieParser());

  // CORS (credentials=true requires exact origin, not "*")
  const allowed = buildAllowedOrigins();

  const origin: CorsOptions["origin"] = (
    requestOrigin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    // Allow non-browser requests (curl, server-to-server)
    if (!requestOrigin) return callback(null, true);

    const normalized = normalizeOrigin(requestOrigin);
    return callback(null, allowed.has(normalized));
  };

  app.enableCors({
    origin,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization", "Accept-Language"],
    credentials: true,
  });

  // Global validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const port = process.env.PORT || 4000;
  await app.listen(port, "0.0.0.0");

  console.log(`Backend running in ${process.env.NODE_ENV} mode`);
  console.log(`Backend listening on port ${port}`);
}

bootstrap();
