import { Router } from "express"
import { userRoutes } from "./user.routes"
import { scenarioRoutes } from "./scenario.routes"
import { resultRoutes } from "./result.routes"
import { moduleRoutes } from "./module.routes"

const routes = Router()

routes.use("/users", userRoutes)
routes.use("/scenarios", scenarioRoutes)
routes.use("/results", resultRoutes)
routes.use(moduleRoutes) // A rota base de módulos já contém '/projects/:projectId/modules/tree'

export { routes }
