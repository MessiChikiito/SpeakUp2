// src/middleware/authorizeRole.ts
import { Request, Response, NextFunction } from "express";

const permisosPorRol: Record<string, string[]> = {
  Admin: ["crear_usuario", "eliminar_usuario", "ver_reportes"],
  Moderador: ["validar_denuncias", "ver_reportes"],
  Usuario: ["crear_denuncia", "ver_denuncias"],
};

export function authorizeRole(accion: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !user.rol) {
      return res.status(403).json({ message: "Rol no definido o no autorizado" });
    }

    const permisos = permisosPorRol[user.rol] || [];

    if (!permisos.includes(accion)) {
      return res.status(403).json({ message: "Acceso denegado: permiso insuficiente" });
    }

    next();
  };
}
