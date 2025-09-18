
import express, { type NextFunction, type Request, type Response } from "express";
import bodyParser from "body-parser";

import express from "express";
import cors from "cors";

import categoriaRoutes from "../routes/categoria_routes";
import rolRoutes from "../routes/rol_routes";
import notificacionRoutes from "../routes/notificacion_routes";
import logRoutes from "../routes/log_routes";
import userRoutes from "../routes/user_routes";
import denunciaRoutes from "../routes/denuncia_routes";
import { AppDataSource } from "../config/database";

const app = express();

app.use(cors());
app.use(express.json());

interface RateLimiterOptions {
  windowMs: number;
  max: number;
  message?: any;
  keyGenerator?: (req: Request) => string;
}

function createInMemoryRateLimiter(options: RateLimiterOptions) {
  const buckets = new Map<string, { count: number; resetAt: number }>();
  return (req: Request, res: Response, next: NextFunction) => {
    const key = options.keyGenerator ? options.keyGenerator(req) : req.ip;
    const now = Date.now();
    const limit = options.max;
    const windowMs = options.windowMs;
    if (!key) {
      return next();
    }
    const existing = buckets.get(key);
    if (!existing || existing.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      res.setHeader('X-RateLimit-Limit', String(limit));
      res.setHeader('X-RateLimit-Remaining', String(limit - 1));
      res.setHeader('X-RateLimit-Reset', String(Math.ceil((now + windowMs) / 1000)));
      return next();
    }
    if (existing.count >= limit) {
      const retryAfterSec = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
      res.setHeader('Retry-After', String(retryAfterSec));
      res.setHeader('X-RateLimit-Limit', String(limit));
      res.setHeader('X-RateLimit-Remaining', '0');
      res.setHeader('X-RateLimit-Reset', String(Math.ceil(existing.resetAt / 1000)));
      return res.status(429).json(options.message ?? { error: 'Demasiadas solicitudes. Intenta más tarde.' });
    }
    existing.count += 1;
    res.setHeader('X-RateLimit-Limit', String(limit));
    res.setHeader('X-RateLimit-Remaining', String(limit - existing.count));
    res.setHeader('X-RateLimit-Reset', String(Math.ceil(existing.resetAt / 1000)));
    return next();
  };
}

const loginLimiter = createInMemoryRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error: "Demasiados intentos de inicio de sesión. Intenta nuevamente en unos minutos."
  },
  keyGenerator: (req) => req.ip
});

const denunciasLimiter = createInMemoryRateLimiter({
  windowMs: 60 * 1000,
  max: 120,
  keyGenerator: (req) => req.ip
});

// Rutas
app.use("/categorias", categoriaRoutes);
app.use("/roles", rolRoutes);
app.use("/notificaciones", notificacionRoutes);
app.use("/log",logRoutes);
app.use("/usuarios/login", loginLimiter);
app.use("/logs", logRoutes);
app.use("/log", logRoutes);
app.use("/usuarios", userRoutes);
app.use("/denuncias", denunciasLimiter, denunciaRoutes);

app.get("/health", (_req, res) => {
  const payload: { status: string; database?: "connected" | "disconnected" } = {
    status: "ok",
  };

  if (typeof AppDataSource?.isInitialized === "boolean") {
    payload.database = AppDataSource.isInitialized ? "connected" : "disconnected";
  }

  res.status(200).json(payload);
});

export default app;
