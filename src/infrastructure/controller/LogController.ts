import { Request, Response } from "express";
import { LogApplicationService } from "../../application/log/LogApplicationService";
import { LogAdapter } from "../adapter/LogAdapter";

const logService = new LogApplicationService(new LogAdapter());

export class LogController {
  static async create(request: Request, response: Response): Promise<Response> {
    try {
      const { usuarioId, accion, entidad } = request.body;
      const logId = await logService.createLog({ usuarioId, accion, entidad });
      return response.status(201).json({ id: logId, message: "Log creado exitosamente" });
    } catch (err) {
      return response.status(500).json({ error: "Error al crear log" });
    }
  }

  static async getAll(request: Request, response: Response): Promise<Response> {
    try {
      const logs = await logService.getAllLogs();
      return response.status(200).json(logs);
    } catch (err) {
      return response.status(500).json({ error: "Error al obtener logs" });
    }
  }

  static async getById(request: Request, response: Response): Promise<Response> {
    try {
      const log = await logService.getLogById(Number(request.params.id));
      if (!log) return response.status(404).json({ error: "Log no encontrado" });
      return response.status(200).json(log);
    } catch (err) {
      return response.status(500).json({ error: "Error al obtener log" });
    }
  }

  static async delete(request: Request, response: Response): Promise<Response> {
    try {
      const deleted = await logService.deleteLog(Number(request.params.id));
      if (!deleted) return response.status(404).json({ error: "Log no encontrado" });
      return response.status(200).json({ message: "Log eliminado" });
    } catch (err) {
      return response.status(500).json({ error: "Error al eliminar log" });
    }
  }
}
