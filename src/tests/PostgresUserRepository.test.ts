import { UserAdapter } from "../infrastructure/adapter/UserAdapter";

import { AppDataSource } from "../infrastructure/config/database";

jest.mock("../infrastructure/config/database", () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe("UserAdapter", () => {
  let repo: UserAdapter;

  beforeEach(() => {
    repo = new UserAdapter();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getUserByEmail debería retornar un UserEntity con rolNombre", async () => {
    (AppDataSource.query as jest.Mock).mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          username: "usuario1",
          password_hash: "hashedpwd",
          rol_id: 2,
          status: 1,
          email: "usuario1@test.com",
          created_at: new Date(),
          updated_at: new Date(),
          rol_nombre: "Admin",
        },
      ],
    });

    const user = await repo.getUserByEmail("usuario1@test.com");

    expect(user).not.toBeNull();
    expect(user?.username).toBe("usuario1");
    expect(user?.rolNombre).toBe("Admin");

    // Verificamos que pool.query se llamó con el SQL correcto
    expect(AppDataSource.query).toHaveBeenCalledWith(
      expect.stringContaining("JOIN roles"),
      ["usuario1@test.com"]
    );
  });

  test("getUserByEmail debería retornar null si no existe usuario", async () => {
    (AppDataSource.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

    const user = await repo.getUserByEmail("noexiste@test.com");
    expect(user).toBeNull();
  });
});
