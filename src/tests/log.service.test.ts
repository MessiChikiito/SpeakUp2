import { LogApplicationService } from "../application/log/LogApplicationService";
import { LogPort } from "../domain/log/LogPort";
import { LogEntity } from "../infrastructure/entities/LogEntity";

describe("Pruebas de LogApplicationService", () => {
  let mockRepo: jest.Mocked<LogPort>;
  let service: LogApplicationService;

  beforeEach(() => {
    mockRepo = {
      createLog: jest.fn(),
      deleteLog: jest.fn(),
      getLogById: jest.fn(),
      getAllLogs: jest.fn(),
    };
    service = new LogApplicationService(mockRepo);
  });

  test("Debe registrar un log correctamente", async () => {
    const mockLog = {
      id: 1,
      usuarioId: 5,
      accion: "Creación de usuario",
      entidad: "usuarios",
      fecha: new Date(),
    } as LogEntity;

    (mockRepo.createLog as jest.Mock).mockResolvedValue(1); // retorna id del log creado
    (mockRepo.getLogById as jest.Mock).mockResolvedValue(mockLog);

    const id = await service.createLog({
      usuarioId: 5,
      accion: "Creación de usuario",
      entidad: "usuarios",
    });

    expect(id).toBe(1);
    expect(mockRepo.createLog).toHaveBeenCalledTimes(1);

    const log = await service.getLogById(1);
    expect(log?.accion).toBe("Creación de usuario");
  });
});
