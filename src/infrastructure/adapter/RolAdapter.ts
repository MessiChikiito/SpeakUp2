// RolAdapter.ts
import { Repository } from "typeorm";
import { Rol } from "../../domain/rol/Rol";
import { RolPort } from "../../domain/rol/IRolRepository";
import { RolEntity } from "../entities/RolEntity";
import { AppDataSource } from "../config/database";

export class RolAdapter implements RolPort {
  private rolRepository: Repository<RolEntity>;

  constructor() {
    this.rolRepository = AppDataSource.getRepository(RolEntity);
  }

  private toDomain(entity: RolEntity): Rol {
    return {
      id: entity.id_rol,
      nombre: entity.nombre_rol,
      descripcion: entity.descripcion_rol,
      status: entity.status_rol,
    };
  }

  private toEntity(rol: Omit<Rol, "id">): RolEntity {
    const entity = new RolEntity();
    entity.nombre_rol = rol.nombre;
    entity.descripcion_rol = rol.descripcion;
    entity.status_rol = rol.status;
    return entity;
  }

  async createRol(rol: Omit<Rol, "id">): Promise<number> {
    const newRol = this.toEntity(rol);
    const saved = await this.rolRepository.save(newRol);
    return saved.id_rol;
  }

  async updateRol(id: number, rol: Partial<Rol>): Promise<boolean> {
    const existing = await this.rolRepository.findOne({ where: { id_rol: id } });
    if (!existing) return false;

    Object.assign(existing, {
      nombre_rol: rol.nombre ?? existing.nombre_rol,
      descripcion_rol: rol.descripcion ?? existing.descripcion_rol,
      status_rol: rol.status ?? existing.status_rol,
    });

    await this.rolRepository.save(existing);
    return true;
  }

  async deleteRol(id: number): Promise<boolean> {
    const existing = await this.rolRepository.findOne({ where: { id_rol: id } });
    if (!existing) return false;

    existing.status_rol = 0; // baja lógica
    await this.rolRepository.save(existing);
    return true;
  }

  async getRolById(id: number): Promise<Rol | null> {
    const rol = await this.rolRepository.findOne({ where: { id_rol: id } });
    return rol ? this.toDomain(rol) : null;
  }

  async getAllRoles(): Promise<Rol[]> {
    const roles = await this.rolRepository.find();
    return roles.map(this.toDomain);
  }
}
