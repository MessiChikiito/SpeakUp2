export interface CreateRolDTO {
    nombre: string;
    descripcion: string;
    status?: number;
}

export interface UpdateRolDTO {
    nombre?: string;
    descripcion?: string;
    status?: number;
}

export interface RolDTO {
    id: number;
    nombre: string;
    descripcion: string;
    status: number;
}
