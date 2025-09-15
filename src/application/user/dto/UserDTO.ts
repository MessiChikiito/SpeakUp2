export interface UserDTO {
  id: number;
  username: string;
  email: string;
  rolId: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
  rolId?: number;
  status?: number;
}

export interface UpdateUserDTO {
  username?: string;
  email?: string;
  password?: string;
  rolId?: number;
  status?: number;
}
