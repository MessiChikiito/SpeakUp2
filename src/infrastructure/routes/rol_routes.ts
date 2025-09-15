// RolRouter.ts
import { Router } from "express";
import { RolAdapter } from "../adapter/RolAdapter";
import { RolApplicationService } from "../../application/rol/RolApplicationService";
import { RolController } from "../controller/RolController";

const router = Router();

const rolAdapter = new RolAdapter();
const rolApp = new RolApplicationService(rolAdapter);
const rolController = new RolController(rolApp);

router.post("/", (req, res) => rolController.createRol(req, res));
router.put("/:id", (req, res) => rolController.updateRol(req, res));
router.delete("/:id", (req, res) => rolController.deleteRol(req, res));
router.get("/:id", (req, res) => rolController.getRolById(req, res));
router.get("/", (req, res) => rolController.getAllRoles(req, res));

export default router;
