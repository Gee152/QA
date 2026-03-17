/**
 * Entidade que define um cenário de teste.
 * Contém metadados sobre o teste, como prioridade, descrição e status atual.
 */
export class TestScenario {
    id: string
    name: string
    description: string
    status: 'Pending' | 'InProgress' | 'Completed' | 'Failed'
    priority: number
    createdAt: Date
    updatedAt: Date
    createdByUserId: string
}
