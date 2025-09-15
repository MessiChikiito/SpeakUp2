export interface Notificacion {
  id: number;
  denunciaId: number;
  moderadorId: number;
  mensaje: string;
  leido: boolean;
  createdAt: Date;
}
