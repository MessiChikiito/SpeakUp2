export interface Denuncia {
    id: number;
    titulo: string;
    descripcion: string;
    categoriaId: number;
    usuarioId: number;
    estado: "pendiente" | "validada" | "rechazada";
    fechaCreacion: Date;
    fechaActualizacion?: Date;
    score?: number;
    upCount?: number;
    downCount?: number;
}