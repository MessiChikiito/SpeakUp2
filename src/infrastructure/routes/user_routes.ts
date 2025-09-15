import { Router } from "express";
import { UserController } from "../controller/UserController";
import { UserApplicationService } from "../../application/user/UserApplicationService";
import { UserAdapter } from "../adapter/UserAdapter";

const router = Router();

// Inyección de dependencias
const repo = new UserAdapter();
const app = new UserApplicationService(repo);
const controller = new UserController(app);

router.post("/register", controller.registerUser);
router.post("/login", controller.loginUser);
router.get("/", controller.getAllUsers);
router.get("/:id", controller.getUserById);
router.put("/:id", controller.updateUser);
router.delete("/:id", controller.deleteUserById);

export default router;
