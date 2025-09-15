import { Rol } from "./Rol";

export interface RolPort {
  createRol(rol: Omit<Rol, "id">): Promise<number>;
  updateRol(id: number, rol: Partial<Rol>): Promise<boolean>;
  deleteRol(id: number): Promise<boolean>;
  getRolById(id: number): Promise<Rol | null>;
  getAllRoles(): Promise<Rol[]>;
}
