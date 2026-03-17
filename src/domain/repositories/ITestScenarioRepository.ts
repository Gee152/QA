import { TestScenario } from "../entities/TestScenario"

export interface ITestScenarioRepository {
    findById(id: string): Promise<TestScenario | undefined>
    findAll(): Promise<TestScenario[]>
    save(testScenario: TestScenario): Promise<TestScenario>
}
