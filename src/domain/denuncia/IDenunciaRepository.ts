import { DenunciaDTO, CreateDenunciaDTO, UpdateDenunciaDTO } from "../../application/denuncia/dto/DenunciaDTO";
 
export interface PaginationOptions {
  page: number;
  pageSize: number;
}

export interface IDenunciaRepository {
  create(dto: CreateDenunciaDTO): Promise<DenunciaDTO>;
  findAll(): Promise<DenunciaDTO[]>;
  findById(id: number): Promise<DenunciaDTO | null>;
  /** Obtiene todas con ordenación (recent|top) y el voto del usuario si se pasa userId */
  findAllRanked(
    sort: 'recent' | 'top',
    userId?: number,
    pagination?: PaginationOptions
  ): Promise<DenunciaDTO[]>;
  /** Obtiene una denuncia incluyendo userVote si userId presente */
  findByIdWithUser(id: number, userId?: number): Promise<DenunciaDTO | null>;
  update(id: number, dto: UpdateDenunciaDTO): Promise<DenunciaDTO | null>;
  delete(id: number): Promise<boolean>;
  validar(id: number): Promise<DenunciaDTO | null>;
  findByUser(userId: number): Promise<DenunciaDTO[]>;
  vote(denunciaId: number, userId: number, value: -1 | 0 | 1): Promise<DenunciaDTO | null>;
}
