import express from "express";
import userRoutes from "../routes/user_routes";
import denunciaRoutes from "../routes/denuncia_routes";
import logRoutes from "../routes/log_routes";
import categoriaRoutes from "../routes/categoria_routes";
import rolRoutes from "../routes/rol_routes";
import notificacionRoutes from "../routes/notificacion_routes";
import { ENV } from "../config/env";
import { AppDataSource } from "../config/database"; // 👈 importa tu datasource

const app = express();
app.use(express.json());

// Rutas
app.use("/usuarios", userRoutes);
app.use("/denuncias", denunciaRoutes);
app.use("/logs", logRoutes);
app.use("/categorias", categoriaRoutes);
app.use("/roles", rolRoutes);
app.use("/notificaciones", notificacionRoutes);

// Inicializa la conexión con la BD y luego arranca el server
AppDataSource.initialize()
  .then(() => {
    console.log("📦 Conexión a la base de datos establecida");
    app.listen(ENV.PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${ENV.PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error al inicializar la base de datos:", error);
  });
