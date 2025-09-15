import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { DenunciaEntity } from "../entities/DenunciaEntity";
import { IDenunciaRepository } from "../../domain/denuncia/IDenunciaRepository";
import { DenunciaDTO, CreateDenunciaDTO, UpdateDenunciaDTO } from "../../application/denuncia/dto/DenunciaDTO";

export class DenunciaAdapter implements IDenunciaRepository {
  private repo: Repository<DenunciaEntity>;

  constructor() {
    this.repo = AppDataSource.getRepository(DenunciaEntity);
  }

  private toDomain(entity: DenunciaEntity): DenunciaDTO {
    return {
      id: entity.id,
      titulo: entity.titulo,
      descripcion: entity.descripcion,
      categoriaId: entity.categoriaId,
      ubicacion: entity.ubicacion,
      gravedad: entity.gravedad,
      estado: entity.estado,
      usuarioId: entity.usuarioId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  private toEntity(dto: CreateDenunciaDTO): DenunciaEntity {
    const entity = new DenunciaEntity();
    entity.titulo = dto.titulo;
    entity.descripcion = dto.descripcion;
    entity.categoriaId = dto.categoriaId;
    entity.ubicacion = dto.ubicacion;
    entity.gravedad = dto.gravedad;
    entity.estado = "pendiente";
    entity.usuarioId = dto.usuarioId ?? null;
    entity.status = 1;
    return entity;
  }

  async findAll(): Promise<DenunciaDTO[]> {
    const denuncias = await this.repo.find({ where: { status: 1 } });
    return denuncias.map(d => this.toDomain(d));
  }

  async findById(id: number): Promise<DenunciaDTO | null> {
    const denuncia = await this.repo.findOne({ where: { id, status: 1 } });
    return denuncia ? this.toDomain(denuncia) : null;
  }

  async create(dto: CreateDenunciaDTO): Promise<DenunciaDTO> {
    const entity = this.toEntity(dto);
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async update(id: number, dto: UpdateDenunciaDTO): Promise<DenunciaDTO | null> {
    const denuncia = await this.repo.findOne({ where: { id, status: 1 } });
    if (!denuncia) return null;

    Object.assign(denuncia, dto);
    const updated = await this.repo.save(denuncia);
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<boolean> {
    await this.repo.update(id, { status: 0 });
    return true;
  }

  async validar(id: number): Promise<DenunciaDTO | null> {
    const denuncia = await this.repo.findOne({ where: { id, status: 1 } });
    if (!denuncia) return null;

    denuncia.estado = "validada";
    const updated = await this.repo.save(denuncia);
    return this.toDomain(updated);
  }
}
