export interface NotificacionDTO {
  id: number;
  denunciaId: number;
  moderadorId: number;
  mensaje: string;
  leido: boolean;
  createdAt: Date;
}

export interface CreateNotificacionDTO {
  denunciaId: number;
  moderadorId: number;
  mensaje: string;
  leido?: boolean; // opcional al crear
}

export interface UpdateNotificacionDTO {
  mensaje?: string;
  leido?: boolean;
}
