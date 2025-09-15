import { ICategoriaRepository } from "../../domain/categoria/ICategoriaRepository";
import { CategoriaDTO, CreateCategoriaDTO, UpdateCategoriaDTO } from "./dto/CategoriaDTO";

export class CategoriaApplicationService {
  private port: ICategoriaRepository;

  constructor(port: ICategoriaRepository) {
    this.port = port;
  }

  async getAllCategorias(): Promise<CategoriaDTO[]> {
    return this.port.getAllCategorias();
  }

  async getCategoriaById(id: number): Promise<CategoriaDTO | null> {
    return this.port.getCategoriaById(id);
  }

  async createCategoria(data: CreateCategoriaDTO): Promise<number> {
    return this.port.createCategoria({
      nombre: data.nombre,
      descripcion: data.descripcion ?? null,
      status: data.status ?? 1,
    });
  }

  async updateCategoria(id: number, data: UpdateCategoriaDTO): Promise<boolean> {
    return this.port.updateCategoria(id, data);
  }

  async deleteCategoria(id: number): Promise<boolean> {
    return this.port.deleteCategoria(id);
  }
}
