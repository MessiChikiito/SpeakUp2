export interface CategoriaDTO {
  id: number;
  nombre: string;
  descripcion: string | null;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoriaDTO {
  nombre: string;
  descripcion?: string | null;
  status?: number;
}

export interface UpdateCategoriaDTO {
  nombre?: string;
  descripcion?: string | null;
  status?: number;
}
