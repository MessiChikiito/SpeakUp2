import { Router } from "express";
import { LogController } from "../controller/LogController";

const router = Router();

router.post("/", LogController.create);
router.get("/", LogController.getAll);
router.get("/:id", LogController.getById);
router.put("/:id", LogController.update);
router.delete("/:id", LogController.delete);

export default router;
