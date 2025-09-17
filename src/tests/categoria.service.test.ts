import { CategoriaApplicationService } from "../application/categoria/CategoriaApplicationService";
import { ICategoriaRepository } from "../domain/categoria/ICategoriaRepository";
import { CategoriaEntity } from "../infrastructure/entities/CategoriaEntity";

describe("Pruebas de CategoriaApplicationService", () => {
  let mockRepo: jest.Mocked<ICategoriaRepository>;
  let service: CategoriaApplicationService;

  beforeEach(() => {
    mockRepo = {
      createCategoria: jest.fn(),
      updateCategoria: jest.fn(),
      deleteCategoria: jest.fn(),
      getCategoriaById: jest.fn(),
      getAllCategorias: jest.fn(),
    };
    service = new CategoriaApplicationService(mockRepo);
  });

  test("Debe crear una categoría activa", async () => {
    // Simulamos que el repo devuelve el id de la nueva categoría
    (mockRepo.createCategoria as jest.Mock).mockResolvedValue(1);

    const id = await service.createCategoria({
      nombre: "Seguridad",
      descripcion: "Casos de seguridad",
    });

    expect(id).toBe(1);
    expect(mockRepo.createCategoria).toHaveBeenCalledWith({
      nombre: "Seguridad",
      descripcion: "Casos de seguridad",
      status: 1,
    });
    expect(mockRepo.createCategoria).toHaveBeenCalledTimes(1);
  });

  test("Debe obtener todas las categorías", async () => {
    const categorias = [
      {
        id: 1,
        nombre: "Seguridad",
        descripcion: "Casos de seguridad",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ] as CategoriaEntity[];

    (mockRepo.getAllCategorias as jest.Mock).mockResolvedValue(categorias);

    const result = await service.getAllCategorias();

    expect(result.length).toBe(1);
    expect(result[0].nombre).toBe("Seguridad");
    expect(mockRepo.getAllCategorias).toHaveBeenCalledTimes(1);
  });
});
