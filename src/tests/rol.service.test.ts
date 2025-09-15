import { RolApplicationService } from "../application/rol/RolApplicationService";
import { RolPort } from "../domain/rol/IRolRepository";
import { RolEntity } from "../infrastructure/entities/RolEntity";

describe("Pruebas de RolApplicationService", () => {
  let mockRepo: jest.Mocked<RolPort>;
  let service: RolApplicationService;

  beforeEach(() => {
    mockRepo = {
      createRol: jest.fn(),
      updateRol: jest.fn(),
      deleteRol: jest.fn(),
      getRolById: jest.fn(),
      getAllRoles: jest.fn(),
    };
    service = new RolApplicationService(mockRepo);
  });

  test("Debe crear un rol con status 1 por defecto", async () => {
    // Simulamos la entidad devuelta
    const mockRol = new RolEntity(
      1,
      "Moderador",
      "Valida denuncias",
      1
    );

    // El puerto devuelve solo el id
    (mockRepo.createRol as jest.Mock).mockResolvedValue(mockRol.id_rol);

    const rolId = await service.createRol({
      nombre: "Moderador",
      descripcion: "Valida denuncias",
    });

    expect(rolId).toBe(1);
    expect(mockRepo.createRol).toHaveBeenCalledTimes(1);
    expect(mockRepo.createRol).toHaveBeenCalledWith({
      nombre: "Moderador",
      descripcion: "Valida denuncias",
      status: 1,
    });
  });
});
