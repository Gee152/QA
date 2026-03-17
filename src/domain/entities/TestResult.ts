/**
 * Entidade que representa o resultado da execução de um cenário de teste.
 * Registra o status final, duração, logs e o usuário responsável pela execução.
 */
export class TestResult {
    id: string
    scenarioId: string
    executionDate: Date
    resultStatus: 'Success' | 'Failure' | 'Skipped'
    durationMs: number
    logs: string
    executedByUserId: string
}
