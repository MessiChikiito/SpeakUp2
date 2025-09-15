import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("notificaciones")
export class NotificacionEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "denuncia_id", type: "int" })
  denunciaId!: number;

  @Column({ name: "moderador_id", type: "int" })
  moderadorId!: number;

  @Column({ type: "varchar", length: 255 })
  mensaje!: string;

  @Column({ type: "boolean", default: false })
  leido!: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
