import { ICategoriaRepository } from "../domain/categoria/ICategoriaRepository";
import { CategoriaEntity } from "../infrastructure/entities/CategoriaEntity";

class CategoriaService {
  constructor(private categoriaRepository: ICategoriaRepository) {}

  async createCategoria(nombre: string, descripcion: string) {
    const categoria = new CategoriaEntity(0, nombre, descripcion, 1, new Date(), new Date());
    return await this.categoriaRepository.create(categoria);
  }
}

describe("Pruebas de CategoriaService", () => {
  let mockRepo: ICategoriaRepository;
  let service: CategoriaService;

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    service = new CategoriaService(mockRepo);
  });

  test("Debe crear una categoría activa", async () => {
    const mockCategoria = new CategoriaEntity(1, "Seguridad", "Casos de seguridad", 1, new Date(), new Date());
    (mockRepo.create as jest.Mock).mockResolvedValue(mockCategoria);

    const categoria = await service.createCategoria("Seguridad", "Casos de seguridad");

    expect(categoria.nombre).toBe("Seguridad");
    expect(categoria.status).toBe(1);
    expect(mockRepo.create).toHaveBeenCalledTimes(1);
  });
});
