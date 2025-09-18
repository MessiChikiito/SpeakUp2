import { Log } from "./Log";

export interface LogPort {
  createLog(log: Omit<Log, "id" | "fecha">): Promise<number>;
  updateLog(
    id: number,
    log: Partial<Omit<Log, "id" | "fecha">>
  ): Promise<Log | null>;
  deleteLog(id: number): Promise<boolean>;
  getLogById(id: number): Promise<Log | null>;
  getAllLogs(): Promise<Log[]>;
}
