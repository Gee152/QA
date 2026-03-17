import { Router } from "express"
import { TestScenarioController } from "../controllers/TestScenarioController"

const scenarioRoutes = Router()
const scenarioController = new TestScenarioController()

scenarioRoutes.post("/", scenarioController.create.bind(scenarioController))

export { scenarioRoutes }
