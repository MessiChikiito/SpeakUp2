import { Router } from "express";
import { DenunciaController } from "../controller/DenunciaController";

const router = Router();

// Métodos estáticos se pasan directo
router.post("/", DenunciaController.create);
router.get("/", DenunciaController.getAll);
router.get("/:id", DenunciaController.getById);
router.patch("/:id", DenunciaController.update);
router.delete("/:id", DenunciaController.delete);
router.patch("/:id/validar", DenunciaController.validar);

export default router;
