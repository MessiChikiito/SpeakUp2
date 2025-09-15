// RolController.ts
import { Request, Response } from "express";
import { RolApplicationService } from "../../application/rol/RolApplicationService";

export class RolController {
  private app: RolApplicationService;

  constructor(app: RolApplicationService) {
    this.app = app;
  }

  async createRol(req: Request, res: Response): Promise<Response> {
    try {
      const id = await this.app.createRol(req.body);
      return res.status(201).json({ message: "Rol creado", id });
    } catch (error) {
      return res.status(500).json({ message: "Error al crear rol" });
    }
  }

  async updateRol(req: Request, res: Response): Promise<Response> {
    try {
      const updated = await this.app.updateRol(Number(req.params.id), req.body);
      if (!updated) return res.status(404).json({ message: "Rol no encontrado" });
      return res.status(200).json({ message: "Rol actualizado" });
    } catch {
      return res.status(500).json({ message: "Error al actualizar rol" });
    }
  }

  async deleteRol(req: Request, res: Response): Promise<Response> {
    try {
      const deleted = await this.app.deleteRol(Number(req.params.id));
      if (!deleted) return res.status(404).json({ message: "Rol no encontrado" });
      return res.status(200).json({ message: "Rol eliminado" });
    } catch {
      return res.status(500).json({ message: "Error al eliminar rol" });
    }
  }

  async getRolById(req: Request, res: Response): Promise<Response> {
    try {
      const rol = await this.app.getRolById(Number(req.params.id));
      if (!rol) return res.status(404).json({ message: "Rol no encontrado" });
      return res.status(200).json(rol);
    } catch {
      return res.status(500).json({ message: "Error al obtener rol" });
    }
  }

  async getAllRoles(req: Request, res: Response): Promise<Response> {
    try {
      const roles = await this.app.getAllRoles();
      return res.status(200).json(roles);
    } catch {
      return res.status(500).json({ message: "Error al obtener roles" });
    }
  }
}
