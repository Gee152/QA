import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { User } from "./User"

@Entity("test_scenarios")
export class TestScenario {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @Column("text")
    description: string

    @Column()
    status: string // 'Pending' | 'InProgress' | 'Completed' | 'Failed'

    @Column("int")
    priority: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @Column()
    createdByUserId: string

    @ManyToOne(() => User)
    @JoinColumn({ name: "createdByUserId" })
    createdByUser: User
}
