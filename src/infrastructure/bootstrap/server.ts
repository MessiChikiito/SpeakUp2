import { ENV } from "../config/env";
import { AppDataSource } from "../config/database"; // 👈 importa tu datasource
import app from "../web/app";

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
