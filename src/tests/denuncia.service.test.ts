import { DenunciaService } from "../application/denuncia/DenunciaApplicationService";
import { IDenunciaRepository } from "../domain/denuncia/IDenunciaRepository";
import { DenunciaEntity } from "../infrastructure/entities/DenunciaEntity";

describe("Pruebas de DenunciaService", () => {
  let mockRepo: IDenunciaRepository;
  let service: DenunciaService;

  beforeEach(() => {
    // Mock del repositorio
    mockRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      validar: jest.fn(),
    };
    service = new DenunciaService(mockRepo);
  });

  test("Debe crear una denuncia con estado pendiente", async () => {
    const mockDenuncia = new DenunciaEntity(
      1,
      "Titulo prueba",
      "Descripción prueba",
      1,
      "Bogotá",
      3,
      "pendiente",
      1
    );

    (mockRepo.create as jest.Mock).mockResolvedValue(mockDenuncia);

    const denuncia = await service.createDenuncia({
      titulo: "Titulo prueba",
      descripcion: "Descripción prueba",
      categoriaId: 1,
      ubicacion: "Bogotá",
      gravedad: 3,
      usuarioId: 1,
    });

    expect(denuncia.estado).toBe("pendiente");
    expect(mockRepo.create).toHaveBeenCalledTimes(1);
  });
});
