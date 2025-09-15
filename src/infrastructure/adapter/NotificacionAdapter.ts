import { Repository } from "typeorm";
import { NotificacionEntity } from "../entities/NotificacionEntity";
import { AppDataSource } from "../config/database";
import { INotificacionRepository } from "../../domain/notificaciones/INotificacionRepository";
import { NotificacionDTO, CreateNotificacionDTO, UpdateNotificacionDTO } from "../../application/notificacion/dto/NotificacionDTO";

export class NotificacionAdapter implements INotificacionRepository {
  private repo: Repository<NotificacionEntity>;

  constructor() {
    this.repo = AppDataSource.getRepository(NotificacionEntity);
  }

  private toDTO(entity: NotificacionEntity): NotificacionDTO {
    return {
      id: entity.id,
      denunciaId: entity.denunciaId,
      moderadorId: entity.moderadorId,
      mensaje: entity.mensaje,
      leido: entity.leido,
      createdAt: entity.createdAt,
    };
  }

  async findAll(): Promise<NotificacionDTO[]> {
    const list = await this.repo.find({ order: { createdAt: "DESC" } });
    return list.map((n) => this.toDTO(n));
  }

  async findById(id: number): Promise<NotificacionDTO | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? this.toDTO(entity) : null;
  }

  async create(data: CreateNotificacionDTO): Promise<NotificacionDTO> {
    const entity = this.repo.create(data);
    const saved = await this.repo.save(entity);
    return this.toDTO(saved);
  }

  async update(id: number, data: UpdateNotificacionDTO): Promise<NotificacionDTO | null> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) return null;

    Object.assign(entity, data);
    const updated = await this.repo.save(entity);
    return this.toDTO(updated);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected !== 0;
  }
}
