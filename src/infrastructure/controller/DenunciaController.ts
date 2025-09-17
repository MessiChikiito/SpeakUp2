// infrastructure/controllers/DenunciaController.ts
import { Request, Response } from "express";
import { DenunciaApplicationService } from "../../application/denuncia/DenunciaApplicationService";
import { DenunciaAdapter } from "../adapter/DenunciaAdapter";
import { LogApplicationService } from "../../application/log/LogApplicationService";
import { LogAdapter } from "../adapter/LogAdapter";
import { AuthRequest } from '../web/AuthMiddleware';

const service = new DenunciaApplicationService(new DenunciaAdapter());
const logService = new LogApplicationService(new LogAdapter());

export class DenunciaController {
  static async create(req: Request, res: Response) {
    try {
      const {
        titulo,
        descripcion,
        categoriaId,
        ubicacion,
        gravedad,
        // usuarioId  <-- se ignora el del body, se usará el del token
      } = req.body || {};

      const missing = [];
      if (!titulo) missing.push("titulo");
      if (!descripcion) missing.push("descripcion");
      if (categoriaId === undefined) missing.push("categoriaId");
      if (!ubicacion) missing.push("ubicacion");
      if (gravedad === undefined) missing.push("gravedad");
      // usuarioId ya no es requerido aquí (token lo aporta)

      if (missing.length) {
        return res.status(400).json({
          error: "Campos requeridos faltantes",
          campos: missing
        });
      }

      const parsedCategoriaId = Number(categoriaId);
      const parsedGravedad = Number(gravedad);

      if (Number.isNaN(parsedCategoriaId)) {
        return res.status(400).json({ error: "categoriaId debe ser numérico" });
      }
      if (!Number.isInteger(parsedGravedad) || parsedGravedad < 1 || parsedGravedad > 5) {
        return res.status(400).json({ error: "gravedad inválida (rango permitido 1-5)" });
      }

      // Obtener el userId desde el middleware de auth
      const userIdFromToken =
        (req as any).user?.id ??
        (req as any).auth?.userId ??
        (req as any).userId;

      if (!userIdFromToken) {
        return res.status(401).json({ error: "No se pudo resolver usuario autenticado" });
      }

      const denuncia = await service.create({
        titulo: String(titulo).trim(),
        descripcion: String(descripcion).trim(),
        categoriaId: parsedCategoriaId,
        ubicacion: String(ubicacion).trim(),
        gravedad: parsedGravedad,
        usuarioId: Number(userIdFromToken) // <-- forzado desde token
      });

      await logService.createLog({
        usuarioId: denuncia.usuarioId || 0,
        accion: "Creación de denuncia",
        entidad: "denuncias",
      });

      return res.status(201).json(denuncia);
    } catch (err) {
      console.error("Error creando denuncia:", err);
      return res.status(500).json({ error: "Error al crear denuncia" });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
  const sort = (req.query.sort as string) || 'recent';
  const validSort = ['recent','top'];
      const finalSort = validSort.includes(sort) ? sort as any : 'recent';
      const userId = (req as any).user?.id || (req as any).auth?.userId || (req as any).userId;
      const denuncias = await service.getAllRanked(finalSort, userId ? Number(userId) : undefined);
      res.json(denuncias);
    } catch (err) {
      console.error('Error obteniendo denuncias:', err);
      res.status(500).json({ error: 'Error al listar denuncias' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const userId = (req as any).user?.id || (req as any).auth?.userId || (req as any).userId;
      const denuncia = await service.getByIdWithUser(id, userId ? Number(userId) : undefined);
      if (!denuncia) return res.status(404).json({ error: 'Denuncia no encontrada' });
      res.json(denuncia);
    } catch (err) {
      console.error('Error obteniendo denuncia:', err);
      res.status(500).json({ error: 'Error al obtener denuncia' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const updates: any = { ...req.body };

      if (updates.gravedad !== undefined) {
        const g = Number(updates.gravedad);
        if (!Number.isInteger(g) || g < 1 || g > 5) {
          return res.status(400).json({ error: "gravedad inválida (rango 1-5)" });
        }
        updates.gravedad = g;
      }
      if (updates.categoriaId !== undefined) {
        const c = Number(updates.categoriaId);
        if (Number.isNaN(c)) {
          return res.status(400).json({ error: "categoriaId debe ser numérico" });
        }
        updates.categoriaId = c;
      }

      const denuncia = await service.update(id, updates);
      if (!denuncia) return res.status(404).json({ error: "Denuncia no encontrada" });

      await logService.createLog({
        usuarioId: denuncia.usuarioId || 0,
        accion: "Actualización de denuncia",
        entidad: "denuncias",
      });

      return res.json(denuncia);
    } catch (err) {
      console.error("Error actualizando denuncia:", err);
      return res.status(500).json({ error: "Error al actualizar denuncia" });
    }
  }

  static async delete(req: Request, res: Response) {
    await service.delete(Number(req.params.id));

    await logService.createLog({
      usuarioId: 0,
      accion: "Borrado lógico de denuncia",
      entidad: "denuncias",
    });

    res.json({ message: "Denuncia eliminada (borrado lógico)" });
  }

  static async validar(req: Request, res: Response) {
    const denuncia = await service.validar(Number(req.params.id));
    if (!denuncia) return res.status(404).json({ error: "Denuncia no encontrada" });

    await logService.createLog({
      usuarioId: denuncia.usuarioId || 0,
      accion: "Validación de denuncia",
      entidad: "denuncias",
    });

    res.json(denuncia);
  }

  static async getMine(req: Request, res: Response) {
    try {
      const userId =
        (req as any).user?.id ??
        (req as any).auth?.userId ??
        (req as any).userId;

      if (!userId) {
        return res.status(401).json({ error: "Usuario no autenticado" });
      }
      // Llamamos directamente al repositorio especializado para evitar traer todo
      const mine = await service.getByUser(Number(userId));
      return res.json(mine);
    } catch (err) {
      console.error("Error obteniendo denuncias del usuario:", err);
      return res.status(500).json({ error: "Error al obtener denuncias del usuario" });
    }
  }

  static async vote(req: Request, res: Response) {
    try {
      const denunciaId = Number(req.params.id);
      if (Number.isNaN(denunciaId)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const userId =
        (req as any).user?.id ??
        (req as any).auth?.userId ??
        (req as any).userId;
      if (!userId) return res.status(401).json({ error: 'No autenticado' });

      const rawValue = (req.body?.value ?? req.query?.value);
      let value: any = Number(rawValue);
      if (![ -1, 0, 1 ].includes(value)) {
        return res.status(400).json({ error: 'value debe ser -1, 0 o 1' });
      }

      const updated = await service.vote(denunciaId, Number(userId), value as -1|0|1);
      if (!updated) return res.status(404).json({ error: 'Denuncia no encontrada' });
      return res.json(updated);
    } catch (err) {
      console.error('Error al votar denuncia:', err);
      return res.status(500).json({ error: 'Error al procesar voto' });
    }
  }
}
