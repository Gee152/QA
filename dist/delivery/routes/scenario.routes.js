"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scenarioRoutes = void 0;
const express_1 = require("express");
const TestScenarioController_1 = require("../controllers/TestScenarioController");
const scenarioRoutes = (0, express_1.Router)();
exports.scenarioRoutes = scenarioRoutes;
const scenarioController = new TestScenarioController_1.TestScenarioController();
scenarioRoutes.post("/", scenarioController.create.bind(scenarioController));
