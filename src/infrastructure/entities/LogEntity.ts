import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("logs")
export class LogEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "usuario_id", type: "int" })
  usuarioId!: number;

  @Column({ type: "varchar", length: 255 })
  accion!: string;

  @Column({ type: "varchar", length: 100 })
  entidad!: string;

  @CreateDateColumn({ name: "fecha" })
  fecha!: Date;
}
