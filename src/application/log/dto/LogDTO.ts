export interface LogDTO {
  id: number;
  usuarioId: number;
  accion: string;
  entidad: string;
  fecha: Date;
}

export interface CreateLogDTO {
  usuarioId: number;
  accion: string;
  entidad: string;
}
