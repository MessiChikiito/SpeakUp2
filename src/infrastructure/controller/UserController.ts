import { Request, Response } from "express";
import { UserApplicationService } from "../../application/user/UserApplicationService";
import { CreateUserDTO, UpdateUserDTO } from "../../application/user/dto/UserDTO";

export class UserController {
  constructor(private app: UserApplicationService) {}

  registerUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { username, email, password, rolId } = req.body;
      const dto: CreateUserDTO = { username, email, password, rolId };
      const user = await this.app.register(dto);
      return res.status(201).json({ message: "Usuario creado", user });
    } catch (err) {
      return res.status(500).json({ error: "Error al registrar usuario" });
    }
  };

  loginUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password } = req.body;
      const token = await this.app.login(email, password);
      return res.json({ token });
    } catch {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
  };

  getAllUsers = async (req: Request, res: Response): Promise<Response> => {
    const users = await this.app.getAll();
    return res.json(users);
  };

  getUserById = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(req.params.id);
    const user = await this.app.getById(id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    return res.json(user);
  };

  updateUser = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(req.params.id);
    const dto: UpdateUserDTO = req.body;
    const updated = await this.app.update(id, dto);
    if (!updated) return res.status(404).json({ error: "Usuario no encontrado" });
    return res.json(updated);
  };

  deleteUserById = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(req.params.id);
    await this.app.delete(id);
    return res.json({ message: "Usuario eliminado (baja lógica)" });
  };
}
