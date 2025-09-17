import { DenunciaApplicationService } from "../application/denuncia/DenunciaApplicationService";
import { IDenunciaRepository } from "../domain/denuncia/IDenunciaRepository";
import { DenunciaEntity } from "../infrastructure/entities/DenunciaEntity";

describe("Pruebas de DenunciaApplicationService", () => {
  let mockRepo: jest.Mocked<IDenunciaRepository>;
  let service: DenunciaApplicationService;

  beforeEach(() => {
    // Mock completo del repositorio
    mockRepo = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findAllRanked: jest.fn(),
      findByIdWithUser: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      validar: jest.fn(),
      findByUser: jest.fn(),
      vote: jest.fn(),
    };
    service = new DenunciaApplicationService(mockRepo);
  });

  test("Debe crear una denuncia con estado pendiente", async () => {
    const mockDenuncia = {
      id: 1,
      titulo: "Titulo prueba",
      descripcion: "Descripción prueba",
      categoriaId: 1,
      ubicacion: "Bogotá",
      gravedad: 3,
      estado: "pendiente",
      usuarioId: 1,
      status: 1,
      score: 0,
      upCount: 0,
      downCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as DenunciaEntity;

    (mockRepo.create as jest.Mock).mockResolvedValue(mockDenuncia);

    const denuncia = await service.create({
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
