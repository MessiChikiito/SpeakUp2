jest.mock("../infrastructure/adapter/LogAdapter", () => ({
  LogAdapter: jest.fn().mockImplementation(() => ({})),
}));

import { LogController } from "../infrastructure/controller/LogController";
import { LogApplicationService } from "../application/log/LogApplicationService";
import { Request, Response } from "express";

describe("LogController.update", () => {
  const buildResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("debe rechazar actualizaciones sin datos", async () => {
    const req = {
      params: { id: "1" },
      body: {},
    } as unknown as Request;
    const res = buildResponse();

    await LogController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "No hay datos para actualizar" });
  });

  test("debe actualizar y devolver el log", async () => {
    const req = {
      params: { id: "2" },
      body: { accion: "Cambio" },
    } as unknown as Request;
    const res = buildResponse();

    const spy = jest
      .spyOn(LogApplicationService.prototype, "updateLog")
      .mockResolvedValue({
        id: 2,
        usuarioId: 1,
        accion: "Cambio",
        entidad: "usuarios",
        fecha: new Date(),
      });

    await LogController.update(req, res);

    expect(spy).toHaveBeenCalledWith(2, { accion: "Cambio" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: 2, accion: "Cambio" })
    );
  });

  test("debe responder 404 cuando el log no existe", async () => {
    const req = {
      params: { id: "3" },
      body: { accion: "Cambio" },
    } as unknown as Request;
    const res = buildResponse();

    jest.spyOn(LogApplicationService.prototype, "updateLog").mockResolvedValue(null);

    await LogController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Log no encontrado" });
  });
});
