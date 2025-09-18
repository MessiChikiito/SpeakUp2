import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import categoriaRoutes from "../routes/categoria_routes";
import rolRoutes from "../routes/rol_routes";
import notificacionRoutes from "../routes/notificacion_routes";
import logRoutes from "../routes/log_routes";
import userRoutes from "../routes/user_routes";
import denunciaRoutes from "../routes/denuncia_routes";

const app = express();
app.use(bodyParser.json());

// Rutas
app.use("/categorias", categoriaRoutes);
app.use("/roles", rolRoutes);
app.use("/notificaciones", notificacionRoutes);
app.use("/logs", logRoutes);
app.use("/usuarios", userRoutes);
app.use("/denuncias", denunciaRoutes);

const shouldExposeDocs = process.env.NODE_ENV !== "production";
if (shouldExposeDocs) {
  const openApiPath = path.resolve(__dirname, "../../../docs/openapi.json");
  try {
    const openApiDocument: Record<string, unknown> = JSON.parse(
      fs.readFileSync(openApiPath, "utf-8")
    );

    app.get("/docs/openapi.json", (_req, res) => {
      res.json(openApiDocument);
    });

    app.get("/docs", (_req, res) => {
      res.type("html").send(`<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>SpeakUp API docs</title>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet" />
    <style>
      body { margin: 0; padding: 0; }
      #redoc-container { height: 100vh; }
    </style>
  </head>
  <body>
    <redoc id="redoc-container" spec-url="/docs/openapi.json"></redoc>
    <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
  </body>
</html>`);
    });
  } catch (error) {
    console.warn("No se pudo cargar la especificación OpenAPI:", error);
  }
}

app.listen(4000, () => {
  console.log("Servidor corriendo en http://localhost:4000");
});
