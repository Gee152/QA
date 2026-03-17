"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resultRoutes = void 0;
const express_1 = require("express");
const TestResultController_1 = require("../controllers/TestResultController");
const resultRoutes = (0, express_1.Router)();
exports.resultRoutes = resultRoutes;
const resultController = new TestResultController_1.TestResultController();
resultRoutes.post("/", resultController.create.bind(resultController));
