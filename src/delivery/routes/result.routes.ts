import { Router } from "express"
import { TestResultController } from "../controllers/TestResultController"

const resultRoutes = Router()
const resultController = new TestResultController()

resultRoutes.post("/", resultController.create.bind(resultController))

export { resultRoutes }
