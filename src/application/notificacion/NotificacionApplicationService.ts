import { INotificacionRepository } from "../../domain/notificaciones/INotificacionRepository";
import { NotificacionDTO, CreateNotificacionDTO, UpdateNotificacionDTO } from "./dto/NotificacionDTO";

export class NotificacionApplicationService {
  private port: INotificacionRepository;

  constructor(port: INotificacionRepository) {
    this.port = port;
  }

  async getAll(): Promise<NotificacionDTO[]> {
    return this.port.findAll();
  }

  async getById(id: number): Promise<NotificacionDTO | null> {
    return this.port.findById(id);
  }

  async create(denunciaId: number, moderadorId: number, mensaje: string): Promise<NotificacionDTO> {
    const notificacion: CreateNotificacionDTO = {
      denunciaId,
      moderadorId,
      mensaje,
      leido: false,
    };
    return this.port.create(notificacion);
  }

  async update(id: number, mensaje?: string, leido?: boolean): Promise<NotificacionDTO | null> {
    const data: UpdateNotificacionDTO = { mensaje, leido };
    return this.port.update(id, data);
  }

  async delete(id: number): Promise<boolean> {
    return this.port.delete(id);
  }
}
