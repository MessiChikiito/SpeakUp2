export interface DenunciaDTO {
  id: number;
  titulo: string;
  descripcion: string;
  categoriaId: number;
  ubicacion: string;
  gravedad: number;
  estado: string;
  usuarioId?: number | null;
  createdAt: Date;
  updatedAt: Date;
  score?: number;
  upCount?: number;
  downCount?: number;
  userVote?: number;
}

export interface CreateDenunciaDTO {
  titulo: string;
  descripcion: string;
  categoriaId: number;
  ubicacion: string;
  gravedad: number;  
  usuarioId?: number; 
}
export interface UpdateDenunciaDTO {
  titulo?: string;
  descripcion?: string;
  categoriaId?: number;
  ubicacion?: string;
  gravedad?: number;
  estado?: string;
  usuarioId?: number | null;
  status?: number;
}