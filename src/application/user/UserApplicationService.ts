import bcrypt from "bcryptjs";
import { IUserRepository } from "../../domain/user/IUserRepository";
import { AuthApplication } from "./AuthApplication";
import { UserDTO, CreateUserDTO, UpdateUserDTO } from "../user/dto/UserDTO";

export class UserApplicationService {
  constructor(private userRepository: IUserRepository) {}

  async register(user: CreateUserDTO): Promise<UserDTO> {
    const existing = await this.userRepository.getUserByEmail(user.email);
    if (existing) throw new Error("Usuario ya existe");

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const created = await this.userRepository.create({ ...user, password: hashedPassword });

    return {
      id: created.id,
      username: created.username,
      email: created.email,
      rolId: created.rolId,
      status: created.status,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) throw new Error("Credenciales inválidas");

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) throw new Error("Credenciales inválidas");

    return AuthApplication.generateToken({ id: user.id, email: user.email, rol: user.rolId });
  }

  async getAll(): Promise<UserDTO[]> {
    const users = await this.userRepository.findAll();
    return users.map(u => ({
      id: u.id,
      username: u.username,
      email: u.email,
      rolId: u.rolId,
      status: u.status,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));
  }

  async getById(id: number): Promise<UserDTO | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      rolId: user.rolId,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async update(id: number, updates: UpdateUserDTO): Promise<UserDTO | null> {
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const updated = await this.userRepository.update(id, updates);
    if (!updated) return null;
    return {
      id: updated.id,
      username: updated.username,
      email: updated.email,
      rolId: updated.rolId,
      status: updated.status,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  async delete(id: number): Promise<boolean> {
    return await this.userRepository.delete(id);
  }
}
