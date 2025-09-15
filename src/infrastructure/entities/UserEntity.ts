import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "usuarios" })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column({ name: "password_hash" })
  passwordHash!: string;

  @Column({ name: "rol_id" })
  rolId!: number;

  @Column({ default: 1 })
  status!: number;

  @Column({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ name: "updated_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
