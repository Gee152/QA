import "reflect-metadata"
import "express-async-errors"
import express from "express"
import "./shared/container"
import { AppDataSource } from "./data-source"
import { routes } from "./delivery/routes"
import { errorMiddleware } from "./delivery/middlewares/errorMiddleware"

const app = express()

app.use(express.json())
app.use(routes)

app.use(errorMiddleware)

const PORT = process.env.PORT || 3000

AppDataSource.initialize().then(async () => {
    console.log("Data Source has been initialized!")
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}).catch(error => console.log(error))
