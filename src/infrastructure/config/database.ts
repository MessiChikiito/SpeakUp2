import { DataSource } from "typeorm";

import { UserEntity } from "../entities/UserEntity";
import { NotificacionEntity } from "../entities/NotificacionEntity";
import { DenunciaEntity } from "../entities/DenunciaEntity";
import { CategoriaEntity } from "../entities/CategoriaEntity";
import { RolEntity } from "../entities/RolEntity";
import { LogEntity } from "../entities/LogEntity";
import { ENV } from "./env"; 

console.log("Config DB:", {
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  user: ENV.DB_USER,
  pass: ENV.DB_PASS ? "***" : "NO DEFINIDA",
  db: ENV.DB_NAME,
});

export const AppDataSource = new DataSource({
  type: "postgres",
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  username: ENV.DB_USER,
  password: String(ENV.DB_PASS),
  database: ENV.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [
    UserEntity,
    NotificacionEntity,
    DenunciaEntity,
    CategoriaEntity,
    RolEntity,
    LogEntity,
  ],
});
