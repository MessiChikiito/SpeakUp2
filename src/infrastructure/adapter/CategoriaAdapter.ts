import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { CategoriaEntity } from "../entities/CategoriaEntity";
import { ICategoriaRepository } from "../../domain/categoria/ICategoriaRepository";
import { CategoriaDTO, CreateCategoriaDTO, UpdateCategoriaDTO } from "../../application/categoria/dto/CategoriaDTO";

export class CategoriaAdapter implements ICategoriaRepository {
  private repo: Repository<CategoriaEntity>;

  constructor() {
    this.repo = AppDataSource.getRepository(CategoriaEntity);
  }

  private toDTO(entity: CategoriaEntity): CategoriaDTO {
    return {
      id: entity.id,
      nombre: entity.nombre,
      descripcion: entity.descripcion,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  private toEntity(dto: CreateCategoriaDTO): CategoriaEntity {
    const entity = new CategoriaEntity();
    entity.nombre = dto.nombre;
    entity.descripcion = dto.descripcion ?? null;
    entity.status = dto.status ?? 1;
    return entity;
  }

  async getAllCategorias(): Promise<CategoriaDTO[]> {
    const categorias = await this.repo.find({ where: { status: 1 }, order: { createdAt: "DESC" } });
    return categorias.map(c => this.toDTO(c));
  }

  async getCategoriaById(id: number): Promise<CategoriaDTO | null> {
    const categoria = await this.repo.findOne({ where: { id, status: 1 } });
    return categoria ? this.toDTO(categoria) : null;
  }

  async createCategoria(dto: CreateCategoriaDTO): Promise<number> {
    const entity = this.toEntity(dto);
    const saved = await this.repo.save(entity);
    return saved.id;
  }

  async updateCategoria(id: number, dto: UpdateCategoriaDTO): Promise<boolean> {
    const categoria = await this.repo.findOne({ where: { id, status: 1 } });
    if (!categoria) return false;

    Object.assign(categoria, dto);
    await this.repo.save(categoria);
    return true;
  }

  async deleteCategoria(id: number): Promise<boolean> {
    await this.repo.update(id, { status: 0 });
    return true;
  }
}
