import { Request, Response } from "express";
import { NotificacionApplicationService } from "../../application/notificacion/NotificacionApplicationService";
import { NotificacionAdapter } from "../adapter/NotificacionAdapter";

const service = new NotificacionApplicationService(new NotificacionAdapter());

export class NotificacionController {
  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const result = await service.getAll();
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al obtener notificaciones" });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const result = await service.getById(id);
      if (!result) return res.status(404).json({ message: "Notificación no encontrada" });
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al obtener la notificación" });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { denunciaId, moderadorId, mensaje } = req.body;
      const result = await service.create(denunciaId, moderadorId, mensaje);
      return res.status(201).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al crear notificación" });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const { mensaje, leido } = req.body;
      const result = await service.update(id, mensaje, leido);
      if (!result) return res.status(404).json({ message: "Notificación no encontrada" });
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al actualizar notificación" });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const deleted = await service.delete(id);
      if (!deleted) return res.status(404).json({ message: "Notificación no encontrada" });
      return res.status(200).json({ message: "Notificación eliminada" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al eliminar notificación" });
    }
  }
}
