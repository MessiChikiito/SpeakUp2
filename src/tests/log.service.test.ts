import { LogService } from "../application/log/LogApplicationService";
import { ILogRepository } from "../domain/log/LogPort";
import { LogEntity } from "../infrastructure/entities/LogEntity";

describe("Pruebas de LogService", () => {
  let mockRepo: ILogRepository;
  let service: LogService;

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    };
    service = new LogService(mockRepo);
  });

  test("Debe registrar un log correctamente", async () => {
    const mockLog = new LogEntity(1, 5, "Creación de usuario", "usuarios");
    (mockRepo.create as jest.Mock).mockResolvedValue(mockLog);

    const log = await service.registrar(5, "Creación de usuario", "usuarios");

    expect(log.accion).toBe("Creación de usuario");
    expect(mockRepo.create).toHaveBeenCalledTimes(1);
  });
});
