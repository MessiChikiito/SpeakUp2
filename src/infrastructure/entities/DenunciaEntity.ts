import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("denuncias")
export class DenunciaEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  titulo!: string;

  @Column({ type: "text" })
  descripcion!: string;

  @Column({ name: "categoria_id", type: "int" })
  categoriaId!: number;

  @Column({ type: "varchar", length: 255 })
  ubicacion!: string;

  @Column({ type: "int" })
  gravedad!: number; 

  @Column({ type: "varchar", default: "pendiente" })
  estado!: string;

  @Column({ name: "usuario_id", type: "int", nullable: true })
  usuarioId?: number | null;

  @Column({ type: "int", default: 1 })
  status!: number;

  @Column({ name: 'score', type: 'int', default: 0 })
  score!: number;

  @Column({ name: 'up_count', type: 'int', default: 0 })
  upCount!: number;

  @Column({ name: 'down_count', type: 'int', default: 0 })
  downCount!: number;

  @Column({ name: 'last_score_update', type: 'timestamp with time zone', nullable: true })
  lastScoreUpdate?: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
