import express from "express";
import cors from "cors";
import categoriaRoutes from "../routes/categoria_routes";
import rolRoutes from "../routes/rol_routes";
import notificacionRoutes from "../routes/notificacion_routes";
import logRoutes from "../routes/log_routes";
import userRoutes from "../routes/user_routes";
import denunciaRoutes from "../routes/denuncia_routes";
import { AppDataSource } from "../config/database";

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/categorias", categoriaRoutes);
app.use("/roles", rolRoutes);
app.use("/notificaciones", notificacionRoutes);
app.use("/logs", logRoutes);
app.use("/usuarios", userRoutes);
app.use("/denuncias", denunciaRoutes);

app.get("/health", (_req, res) => {
  const payload: { status: string; database?: "connected" | "disconnected" } = {
    status: "ok",
  };

  if (typeof AppDataSource?.isInitialized === "boolean") {
    payload.database = AppDataSource.isInitialized ? "connected" : "disconnected";
  }

  res.status(200).json(payload);
});

export default app;
