import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

// Debe coincidir con el utilizado en AuthApplication.ts
const JWT_SECRET = ENV.JWT_SECRET;

export interface AuthRequest extends Request {
  user?: { id: number; role?: string };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token requerido" });
  }
  const token = header.substring(7);
  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    console.log('[auth] payload user =>', payload);
    // Mapeamos id (si el payload por alguna razón trae userId, lo aceptamos también)
    const userId = payload.id ?? payload.userId;
    if (!userId) {
      return res.status(401).json({ error: "Token sin id de usuario" });
    }
    req.user = { id: userId, role: payload.role };
    next();
  } catch (err: any) {
    console.error('[auth] token verify error:', err?.message);
    return res.status(401).json({ error: "Token inválido" });
  }
}
