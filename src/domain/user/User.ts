export interface User {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  rolId: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  rolNombre?: string;
}
