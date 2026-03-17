import { TestResult } from "../entities/TestResult"

export interface ITestResultRepository {
    findById(id: string): Promise<TestResult | undefined>
    findAllByScenarioId(scenarioId: string): Promise<TestResult[]>
    save(testResult: TestResult): Promise<TestResult>
}
