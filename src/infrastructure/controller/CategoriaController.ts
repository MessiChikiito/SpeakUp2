import { Request, Response } from "express";
import { CategoriaApplicationService } from "../../application/categoria/CategoriaApplicationService";
import { CategoriaAdapter } from "../adapter/CategoriaAdapter";

export class CategoriaController {
  private service: CategoriaApplicationService;

  constructor() {
    const adapter = new CategoriaAdapter();
    this.service = new CategoriaApplicationService(adapter);
  }

  async getAll(req: Request, res: Response) {
    try {
      const categorias = await this.service.getAllCategorias();
      res.json(categorias);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener categorías", error });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const categoria = await this.service.getCategoriaById(id);
      if (!categoria) {
        return res.status(404).json({ message: "Categoría no encontrada" });
      }
      res.json(categoria);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener categoría", error });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const nuevaCategoria = await this.service.createCategoria(req.body);
      res.status(201).json(nuevaCategoria);
    } catch (error) {
      res.status(500).json({ message: "Error al crear categoría", error });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const actualizado = await this.service.updateCategoria(id, req.body);
      if (!actualizado) {
        return res.status(404).json({ message: "Categoría no encontrada" });
      }
      res.json({ message: "Categoría actualizada con éxito" });
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar categoría", error });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const eliminado = await this.service.deleteCategoria(id);
      if (!eliminado) {
        return res.status(404).json({ message: "Categoría no encontrada" });
      }
      res.json({ message: "Categoría eliminada con éxito" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar categoría", error });
    }
  }
}
