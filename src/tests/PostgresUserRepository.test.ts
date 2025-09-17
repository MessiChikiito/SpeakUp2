import { UserAdapter } from "../infrastructure/adapter/UserAdapter";
import { AppDataSource } from "../infrastructure/config/database";
import { UserEntity } from "../infrastructure/entities/UserEntity";

jest.mock("../infrastructure/config/database", () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe("UserAdapter", () => {
  let repo: UserAdapter;
  let mockRepo: any;

  beforeEach(() => {
    // Mock del repositorio de TypeORM
    mockRepo = {
      findOne: jest.fn(),
    };

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);

    repo = new UserAdapter();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getUserByEmail debería retornar un User con rolNombre", async () => {
    mockRepo.findOne.mockResolvedValueOnce({
      id: 1,
      username: "usuario1",
      email: "usuario1@test.com",
      passwordHash: "hashedpwd",
      rolId: 2,
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      rolNombre: "Admin",
    });

    const user = await repo.getUserByEmail("usuario1@test.com");

    expect(user).not.toBeNull();
    expect(user?.username).toBe("usuario1");
    expect(user?.rolNombre).toBe("Admin");

    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { email: "usuario1@test.com" } });
  });

  test("getUserByEmail debería retornar null si no existe usuario", async () => {
    mockRepo.findOne.mockResolvedValueOnce(null);

    const user = await repo.getUserByEmail("noexiste@test.com");
    expect(user).toBeNull();
  });
});
