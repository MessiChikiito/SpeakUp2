import { Log } from "../../domain/log/Log";
import { LogPort } from "../../domain/log/LogPort";

export class LogApplicationService {
  private port: LogPort;

  constructor(port: LogPort) {
    this.port = port;
  }

  async createLog(log: Omit<Log, "id" | "fecha">): Promise<number> {
    return this.port.createLog(log);
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
