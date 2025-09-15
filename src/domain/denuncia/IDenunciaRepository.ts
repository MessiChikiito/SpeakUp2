import { DenunciaDTO, CreateDenunciaDTO, UpdateDenunciaDTO } from "../../application/denuncia/dto/DenunciaDTO";
 
export interface IDenunciaRepository {
  findAll(): Promise<DenunciaDTO[]>;
  findById(id: number): Promise<DenunciaDTO | null>;
  create(denuncia: CreateDenunciaDTO): Promise<DenunciaDTO>;
  update(id: number, denuncia: UpdateDenunciaDTO): Promise<DenunciaDTO | null>;
  delete(id: number): Promise<boolean>;
  validar(id: number): Promise<DenunciaDTO | null>;
}
