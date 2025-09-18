import { Log } from "../../domain/log/Log";
import { LogPort } from "../../domain/log/LogPort";

export class FechaNoEditableError extends Error {
  constructor() {
    super("El campo fecha no puede modificarse");
    this.name = "FechaNoEditableError";
  }
}

export class LogApplicationService {
  private port: LogPort;

  constructor(port: LogPort) {
    this.port = port;
  }

  async createLog(log: Omit<Log, "id" | "fecha">): Promise<number> {
    return this.port.createLog(log);
  }

  async updateLog(
    id: number,
    log: Partial<Omit<Log, "id" | "fecha">>
  ): Promise<Log | null> {
    const logConFecha = log as Partial<Log>;

    if (logConFecha.fecha !== undefined) {
      throw new FechaNoEditableError();
    }

    const { usuarioId, accion, entidad } = log;
    const payload: Partial<Omit<Log, "id" | "fecha">> = {};

    if (usuarioId !== undefined) {
      payload.usuarioId = usuarioId;
    }
    if (accion !== undefined) {
      payload.accion = accion;
    }
    if (entidad !== undefined) {
      payload.entidad = entidad;
    }

    return this.port.updateLog(id, payload);
  }

  async deleteLog(id: number): Promise<boolean> {
    return this.port.deleteLog(id);
  }

  async getLogById(id: number): Promise<Log | null> {
    return this.port.getLogById(id);
  }

  async getAllLogs(): Promise<Log[]> {
    return this.port.getAllLogs();
  }
}
