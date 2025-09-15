import { Router } from "express";
import { NotificacionController } from "../controller/NotificacionController";

const router = Router();
const controller = new NotificacionController();


router.get("/", (request, response) => controller.getAll(request, response));
router.get("/:id", (request, response) => controller.getById(request, response));
router.post("/", (request, response) => controller.create(request, response));
router.put("/:id", (request, response) => controller.update(request, response));
router.delete("/:id", (request, response) => controller.delete(request, response));

export default router;
