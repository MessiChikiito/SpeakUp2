import { Request, Response, NextFunction } from "express";
import { AuthApplication } from "../../application/user/AuthApplication";

export function authenticateToken(request: Request, response: Response, next: NextFunction) {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) return response.status(401).json({ message: "Token requerido" });

  try {
    const user = AuthApplication.verifyToken(token);
    (request as any).user = user; // guarda info del token en req para usar luego
    next();
  } catch (error) {
    return response.status(403).json({ message: "Token inválido" });
  }
}
