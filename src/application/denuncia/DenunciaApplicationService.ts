import { IDenunciaRepository } from "../../domain/denuncia/IDenunciaRepository";
import { DenunciaDTO, CreateDenunciaDTO, UpdateDenunciaDTO } from "./dto/DenunciaDTO";

export class DenunciaApplicationService {
  constructor(private repo: IDenunciaRepository) {}

  async create(dto: CreateDenunciaDTO): Promise<DenunciaDTO> {
    return this.repo.create(dto);
  }

  async getAll(): Promise<DenunciaDTO[]> {
    return this.repo.findAll();
  }

  async getById(id: number): Promise<DenunciaDTO | null> {
    return this.repo.findById(id);
  }

  async update(id: number, dto: UpdateDenunciaDTO): Promise<DenunciaDTO | null> {
    return this.repo.update(id, dto);
  }

  async delete(id: number): Promise<boolean> {
    return this.repo.delete(id);
  }

  async validar(id: number): Promise<DenunciaDTO | null> {
    return this.repo.validar(id);
  }
}
