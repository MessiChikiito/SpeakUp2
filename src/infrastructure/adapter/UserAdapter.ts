import { AppDataSource } from '../config/database';
import { UserEntity } from '../entities/UserEntity';
import { IUserRepository } from '../../domain/user/IUserRepository';
import { User } from '../../domain/user/User';
import { CreateUserDTO, UpdateUserDTO } from '../../application/user/dto/UserDTO';

export class UserAdapter implements IUserRepository {
  private repo = AppDataSource.getRepository(UserEntity);

  private toDomain(entity: UserEntity & Partial<Record<'status' | 'createdAt' | 'updatedAt', any>>): User {
    return {
      id: entity.id,
      username: entity.username,
      email: entity.email,
      passwordHash: entity.passwordHash,
      rolId: entity.rolId,
      status: (entity as any).status ?? 1,
      createdAt: (entity as any).createdAt ?? new Date(),
      updatedAt: (entity as any).updatedAt ?? new Date(),
      rolNombre: (entity as any).rolNombre,
    };
  }

  async findAll(): Promise<User[]> {
    const entities = await this.repo.find();
    return entities.map((e) => this.toDomain(e as any));
  }

  async findById(id: number): Promise<User | null> {
    const found = await this.repo.findOne({ where: { id } });
    return found ? this.toDomain(found as any) : null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const found = await this.repo.findOne({ where: { email } });
    return found ? this.toDomain(found as any) : null;
  }

  async create(user: CreateUserDTO): Promise<User> {

    const entity = this.repo.create({
      username: user.username,
      email: user.email,
      passwordHash: user.password, 
      rolId: user.rolId ?? 2,
    });
    const saved = await this.repo.save(entity);
    return this.toDomain(saved as any);
  }

  async update(id: number, updates: UpdateUserDTO): Promise<User | null> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) return null;

    if (updates.username !== undefined) entity.username = updates.username;
    if (updates.email !== undefined) entity.email = updates.email;
    if (updates.password !== undefined) entity.passwordHash = updates.password; 
    if (updates.rolId !== undefined) entity.rolId = updates.rolId;

    const saved = await this.repo.save(entity);
    return this.toDomain(saved as any);
  }

  async delete(id: number): Promise<boolean> {
    const res = await this.repo.delete(id);
    return !!res.affected && res.affected > 0;
  }
}
