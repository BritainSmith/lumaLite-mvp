import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class TaskEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column("varchar")
  type: string;

  @Column("simple-array")
  tasks: string[];

  @Column("simple-array")
  worries: string[];

  @Column("simple-array")
  ideas: string[];

  @Column("simple-array")
  random: string[];
}
