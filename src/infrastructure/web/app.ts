import express from "express";
import bodyParser from "body-parser";
import categoriaRoutes from "../routes/categoria_routes";
import rolRoutes from "../routes/rol_routes";
import notificacionRoutes from "../routes/notificacion_routes";
import logRoutes from "../routes/rol_routes";
import userRoutes from "../routes/user_routes";
import denunciaRoutes from "../routes/denuncia_routes";

const app = express();
app.use(bodyParser.json());

// Rutas
app.use("/categorias", categoriaRoutes);
app.use("/roles", rolRoutes);
app.use("/notificaciones", notificacionRoutes);
app.use("/log",logRoutes);
app.use("/usuarios", userRoutes);
app.use("/denuncias", denunciaRoutes);

app.listen(4000, () => {
  console.log("Servidor corriendo en http://localhost:4000");
});
