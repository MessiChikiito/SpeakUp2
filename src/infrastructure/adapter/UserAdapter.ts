import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { UserEntity } from "../entities/UserEntity";
import { IUserRepository } from "../../domain/user/IUserRepository";
import { User } from "../../domain/user/User";
import { CreateUserDTO, UpdateUserDTO } from "../../application/user/dto/UserDTO";

export class UserAdapter implements IUserRepository {
  private repo: Repository<UserEntity>;

  constructor() {
    this.repo = AppDataSource.getRepository(UserEntity);
  }

  private toDomain(entity: UserEntity): User {
    return {
      id: entity.id,
      username: entity.username,
      email: entity.email,
      passwordHash: entity.passwordHash,
      rolId: entity.rolId,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  private toEntity(dto: CreateUserDTO): UserEntity {
    const entity = new UserEntity();
    entity.username = dto.username;
    entity.email = dto.email;
    entity.passwordHash = dto.password; // hash se genera en Application
    entity.rolId = dto.rolId ?? 1;
    entity.status = dto.status ?? 1;
    return entity;
  }

  async findAll(): Promise<User[]> {
    const users = await this.repo.find({ where: { status: 1 } });
    return users.map(u => this.toDomain(u));
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.repo.findOne({ where: { id, status: 1 } });
    return user ? this.toDomain(user) : null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.repo.findOne({ where: { email, status: 1 } });
    return user ? this.toDomain(user) : null;
  }

  async create(dto: CreateUserDTO): Promise<User> {
    const entity = this.toEntity(dto);
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async update(id: number, dto: UpdateUserDTO): Promise<User | null> {
    const user = await this.repo.findOne({ where: { id, status: 1 } });
    if (!user) return null;

    Object.assign(user, {
      username: dto.username ?? user.username,
      email: dto.email ?? user.email,
      passwordHash: dto.password ?? user.passwordHash,
      rolId: dto.rolId ?? user.rolId,
      status: dto.status ?? user.status,
    });

    const updated = await this.repo.save(user);
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<boolean> {
    await this.repo.update(id, { status: 0 });
    return true;
  }
}
