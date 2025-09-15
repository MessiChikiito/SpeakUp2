import { RolPort } from "../../domain/rol/IRolRepository";
import { RolDTO, CreateRolDTO, UpdateRolDTO } from "./dto/RolDTO";
import { Rol } from "../../domain/rol/Rol";

export class RolApplicationService {
  private port: RolPort;

  constructor(port: RolPort) {
    this.port = port;
  }

  async createRol(data: CreateRolDTO): Promise<number> {
    const rol: Omit<Rol, "id"> = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      status: data.status ?? 1,
    };
    return this.port.createRol(rol);
  }

  async updateRol(id: number, data: UpdateRolDTO): Promise<boolean> {
    return this.port.updateRol(id, data);
  }

  async deleteRol(id: number): Promise<boolean> {
    return this.port.deleteRol(id);
  }

  async getRolById(id: number): Promise<RolDTO | null> {
    return this.port.getRolById(id);
  }

  async getAllRoles(): Promise<RolDTO[]> {
    return this.port.getAllRoles();
  }
}
