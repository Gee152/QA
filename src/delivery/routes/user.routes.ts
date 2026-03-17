import { Router } from "express"
import { UserController } from "../controllers/UserController"
import { authMiddleware } from "../middlewares/authMiddleware"

const userRoutes = Router()
const userController = new UserController()

// Rota pública — criação de conta
userRoutes.post("/", userController.create.bind(userController))

// Rota pública — login e geração de JWT
userRoutes.post("/session", userController.authenticate.bind(userController))

// Rotas protegidas — exigem Bearer token válido
userRoutes.get("/", authMiddleware, userController.list.bind(userController))
userRoutes.get("/:id", authMiddleware, userController.get.bind(userController))
userRoutes.put("/:id", authMiddleware, userController.update.bind(userController))
userRoutes.delete("/:id", authMiddleware, userController.delete.bind(userController))

export { userRoutes }
