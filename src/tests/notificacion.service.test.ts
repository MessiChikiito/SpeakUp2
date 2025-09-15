import { NotificacionApplicationService } from "../application/notificacion/NotificacionApplicationService";
import { INotificacionRepository } from "../domain/notificaciones/INotificacionRepository";
import { NotificacionEntity } from "../infrastructure/entities/NotificacionEntity";

describe("Pruebas de NotificacionApplicationService", () => {
  let mockRepo: INotificacionRepository;
  let service: NotificacionApplicationService;

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    service = new NotificacionApplicationService(mockRepo);
  });

  test("Debe crear una notificación no leída", async () => {
    const mockNotificacion = new NotificacionEntity(1, 2, 3, "Revisar denuncia", false, new Date());
    (mockRepo.create as jest.Mock).mockResolvedValue(mockNotificacion);

    const notificacion = await service.create(2, 3, "Revisar denuncia");

    expect(notificacion.leido).toBe(false);
    expect(notificacion.mensaje).toBe("Revisar denuncia");
    expect(mockRepo.create).toHaveBeenCalledTimes(1);
  });
});
