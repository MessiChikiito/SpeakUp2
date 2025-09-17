import { UserApplicationService } from "../application/user/UserApplicationService";
import { IUserRepository } from "../domain/user/IUserRepository";
import bcrypt from "bcryptjs";
import { AuthApplication } from "../application/user/AuthApplication";

jest.mock("bcryptjs");
jest.mock("../application/user/AuthApplication");

describe("Pruebas de UserApplicationService", () => {
  let mockRepo: jest.Mocked<IUserRepository>;
  let service: UserApplicationService;

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      getUserByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    service = new UserApplicationService(mockRepo);
    jest.clearAllMocks();
  });

  // ✅ Registro exitoso
  test("Debe registrar un usuario nuevo", async () => {
    (mockRepo.getUserByEmail as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed123");

    const createdUser = {
      id: 1,
      username: "tester",
      email: "tester@mail.com",
      passwordHash: "hashed123",
      rolId: 1,
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (mockRepo.create as jest.Mock).mockResolvedValue(createdUser);

    const result = await service.register({
      username: "tester",
      email: "tester@mail.com",
      password: "123456",
      rolId: 1,
    });

    expect(result.username).toBe("tester");
    expect(result.email).toBe("tester@mail.com");
    expect(result.rolId).toBe(1);
    expect(mockRepo.create).toHaveBeenCalledTimes(1);
  });

  // 🔴 Registro con email duplicado
  test("No debe registrar un usuario si el email ya existe", async () => {
    (mockRepo.getUserByEmail as jest.Mock).mockResolvedValue({
      id: 1,
      username: "tester",
      email: "tester@mail.com",
      passwordHash: "hash",
      rolId: 1,
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(
      service.register({
        username: "tester",
        email: "tester@mail.com",
        password: "123456",
        rolId: 1,
      })
    ).rejects.toThrow("Usuario ya existe");
  });

  // ✅ Login exitoso
  test("Debe iniciar sesión con credenciales válidas y devolver token y usuario", async () => {
    const mockUser = {
      id: 1,
      username: "tester",
      email: "tester@mail.com",
      passwordHash: "hashed123",
      rolId: 1,
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (mockRepo.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (AuthApplication.generateToken as jest.Mock).mockReturnValue("fake-jwt-token");

    const result = await service.login("tester@mail.com", "123456");

    expect(result.token).toBe("fake-jwt-token");
    expect(result.user.email).toBe("tester@mail.com");
    expect(result.user.username).toBe("tester");
    expect(bcrypt.compare).toHaveBeenCalledWith("123456", "hashed123");
  });

  // 🔴 Login con email incorrecto
  test("No debe iniciar sesión si el email no existe", async () => {
    (mockRepo.getUserByEmail as jest.Mock).mockResolvedValue(null);

    await expect(service.login("nonexistent@mail.com", "123456"))
      .rejects
      .toThrow("Credenciales inválidas");
  });

  // 🔴 Login con contraseña incorrecta
  test("No debe iniciar sesión si la contraseña es incorrecta", async () => {
    const mockUser = {
      id: 1,
      username: "tester",
      email: "tester@mail.com",
      passwordHash: "hashed123",
      rolId: 1,
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (mockRepo.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(service.login("tester@mail.com", "wrongpass"))
      .rejects
      .toThrow("Credenciales inválidas");
  });

  // ✅ Obtener todos los usuarios
  test("Debe obtener todos los usuarios", async () => {
    const users = [
      {
        id: 1,
        username: "tester1",
        email: "one@mail.com",
        passwordHash: "hash1",
        rolId: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        username: "tester2",
        email: "two@mail.com",
        passwordHash: "hash2",
        rolId: 2,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    (mockRepo.findAll as jest.Mock).mockResolvedValue(users);

    const result = await service.getAll();

    expect(result.length).toBe(2);
    expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
  });
});
