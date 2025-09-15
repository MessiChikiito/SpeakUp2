import { Repository } from "typeorm";
import { Log } from "../../domain/log/Log";
import { LogPort } from "../../domain/log/LogPort";
import { LogEntity } from "../entities/LogEntity";
import { AppDataSource } from "../config/database";

export class LogAdapter implements LogPort {
  private logRepository: Repository<LogEntity>;

  constructor() {
    this.logRepository = AppDataSource.getRepository(LogEntity);
  }

  private toDomain(log: LogEntity): Log {
    return {
      id: log.id,
      usuarioId: log.usuarioId,
      accion: log.accion,
      entidad: log.entidad,
      fecha: log.fecha,
    };
  }

  private toEntity(log: Omit<Log, "id" | "fecha">): LogEntity {
    const logEntity = new LogEntity();
    logEntity.usuarioId = log.usuarioId;
    logEntity.accion = log.accion;
    logEntity.entidad = log.entidad;
    return logEntity;
  }

  async createLog(log: Omit<Log, "id" | "fecha">): Promise<number> {
    const newLog = this.toEntity(log);
    const savedLog = await this.logRepository.save(newLog);
    return savedLog.id;
  }

  async deleteLog(id: number): Promise<boolean> {
    const result = await this.logRepository.delete(id);
    return result.affected !== 0;
  }

  async getLogById(id: number): Promise<Log | null> {
    const log = await this.logRepository.findOne({ where: { id } });
    return log ? this.toDomain(log) : null;
  }

  async getAllLogs(): Promise<Log[]> {
    const logs = await this.logRepository.find({ order: { fecha: "DESC" } });
    return logs.map((log) => this.toDomain(log));
  }
}
