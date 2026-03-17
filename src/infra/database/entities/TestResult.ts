import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { TestScenario } from "./TestScenario"
import { User } from "./User"

@Entity("test_results")
export class TestResult {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    scenarioId: string

    @ManyToOne(() => TestScenario)
    @JoinColumn({ name: "scenarioId" })
    scenario: TestScenario

    @CreateDateColumn()
    executionDate: Date

    @Column()
    resultStatus: string // 'Success' | 'Failure' | 'Skipped'

    @Column("int")
    durationMs: number

    @Column("text")
    logs: string

    @Column()
    executedByUserId: string

    @ManyToOne(() => User)
    @JoinColumn({ name: "executedByUserId" })
    executedByUser: User
}
