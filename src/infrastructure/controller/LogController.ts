import { Request, Response } from "express";
import {
  FechaNoEditableError,
  LogApplicationService,
} from "../../application/log/LogApplicationService";
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

  static async update(request: Request, response: Response): Promise<Response> {
    try {
      const id = Number(request.params.id);
      if (Number.isNaN(id)) {
        return response.status(400).json({ error: "ID inválido" });
      }

      const { usuarioId, accion, entidad, fecha } = request.body ?? {};

      if (fecha !== undefined) {
        return response
          .status(400)
          .json({ error: "El campo fecha no puede modificarse" });
      }
      const updates: Partial<{ usuarioId: number; accion: string; entidad: string }> = {};

      if (usuarioId !== undefined) {
        const parsedUsuarioId = Number(usuarioId);
        if (Number.isNaN(parsedUsuarioId)) {
          return response.status(400).json({ error: "usuarioId inválido" });
        }
        updates.usuarioId = parsedUsuarioId;
      }

      if (accion !== undefined) {
        if (typeof accion !== "string" || !accion.trim()) {
          return response.status(400).json({ error: "accion inválida" });
        }
        updates.accion = accion;
      }

      if (entidad !== undefined) {
        if (typeof entidad !== "string" || !entidad.trim()) {
          return response.status(400).json({ error: "entidad inválida" });
        }
        updates.entidad = entidad;
      }

      if (Object.keys(updates).length === 0) {
        return response.status(400).json({ error: "No hay datos para actualizar" });
      }

      const updatedLog = await logService.updateLog(id, updates);
      if (!updatedLog) {
        return response.status(404).json({ error: "Log no encontrado" });
      }

      return response.status(200).json(updatedLog);
    } catch (err) {
      if (err instanceof FechaNoEditableError) {
        return response
          .status(400)
          .json({ error: "El campo fecha no puede modificarse" });
      }

      return response.status(500).json({ error: "Error al actualizar log" });
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
