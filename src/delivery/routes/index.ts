import { Router } from "express"
import { userRoutes } from "./user.routes"
import { scenarioRoutes } from "./scenario.routes"
import { resultRoutes } from "./result.routes"

const routes = Router()

routes.use("/users", userRoutes)
routes.use("/scenarios", scenarioRoutes)
routes.use("/results", resultRoutes)

export { routes }
