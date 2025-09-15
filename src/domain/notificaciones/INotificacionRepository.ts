import { NotificacionDTO, CreateNotificacionDTO, UpdateNotificacionDTO } from "../../application/notificacion/dto/NotificacionDTO";

export interface INotificacionRepository {
  findAll(): Promise<NotificacionDTO[]>;
  findById(id: number): Promise<NotificacionDTO | null>;
  create(data: CreateNotificacionDTO): Promise<NotificacionDTO>;
  update(id: number, data: UpdateNotificacionDTO): Promise<NotificacionDTO | null>;
  delete(id: number): Promise<boolean>;
}
