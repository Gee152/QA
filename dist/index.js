"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("express-async-errors");
const express_1 = __importDefault(require("express"));
require("./shared/container");
const data_source_1 = require("./data-source");
const routes_1 = require("./delivery/routes");
const errorMiddleware_1 = require("./delivery/middlewares/errorMiddleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(routes_1.routes);
app.use(errorMiddleware_1.errorMiddleware);
const PORT = process.env.PORT || 3000;
data_source_1.AppDataSource.initialize().then(async () => {
    console.log("Data Source has been initialized!");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => console.log(error));
