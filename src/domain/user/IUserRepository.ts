import { User } from "./User";
import { CreateUserDTO, UpdateUserDTO } from "../../application/user/dto/UserDTO";

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  create(user: CreateUserDTO): Promise<User>;
  update(id: number, updates: UpdateUserDTO): Promise<User | null>;
  delete(id: number): Promise<boolean>;
}
