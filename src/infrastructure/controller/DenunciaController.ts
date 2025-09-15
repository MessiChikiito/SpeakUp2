// infrastructure/controllers/DenunciaController.ts
import { Request, Response } from "express";
import { DenunciaApplicationService } from "../../application/denuncia/DenunciaApplicationService";
import { DenunciaAdapter } from "../adapter/DenunciaAdapter";
import { LogApplicationService } from "../../application/log/LogApplicationService";
import { LogAdapter } from "../adapter/LogAdapter";

const service = new DenunciaApplicationService(new DenunciaAdapter());
const logService = new LogApplicationService(new LogAdapter());

export class DenunciaController {
  static async create(req: Request, res: Response) {
    try {
      const denuncia = await service.create(req.body);

      await logService.createLog({
        usuarioId: denuncia.usuarioId || 0,
        accion: "Creación de denuncia",
        entidad: "denuncias",
      });

      res.status(201).json(denuncia);
    } catch (err) {
      res.status(500).json({ error: "Error al crear denuncia" });
    }
  }

  static async getAll(req: Request, res: Response) {
    const denuncias = await service.getAll();
    res.json(denuncias);
  }

  static async getById(req: Request, res: Response) {
    const denuncia = await service.getById(Number(req.params.id));
    if (!denuncia) return res.status(404).json({ error: "Denuncia no encontrada" });
    res.json(denuncia);
  }

  static async update(req: Request, res: Response) {
    const denuncia = await service.update(Number(req.params.id), req.body);
    if (!denuncia) return res.status(404).json({ error: "Denuncia no encontrada" });

    await logService.createLog({
      usuarioId: denuncia.usuarioId || 0,
      accion: "Actualización de denuncia",
      entidad: "denuncias",
    });

    res.json(denuncia);
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
}
