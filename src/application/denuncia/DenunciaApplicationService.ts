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

  async getAllRanked(sort: 'recent'|'top', userId?: number): Promise<DenunciaDTO[]> {
    return this.repo.findAllRanked(sort, userId);
  }

  async getById(id: number): Promise<DenunciaDTO | null> {
    return this.repo.findById(id);
  }

  async getByIdWithUser(id: number, userId?: number): Promise<DenunciaDTO | null> {
    return this.repo.findByIdWithUser(id, userId);
  }

  async getByUser(userId: number) {
    return this.repo.findByUser(userId);
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

  async vote(id: number, userId: number, value: -1 | 0 | 1) {
    return this.repo.vote(id, userId, value);
  }
}
