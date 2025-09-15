import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("roles")
export class RolEntity {
  @PrimaryGeneratedColumn()
  id_rol!: number;

  @Column({ type: "varchar", length: 150 })
  nombre_rol!: string;

  @Column({ type: "varchar", length: 255 })
  descripcion_rol!: string;

  @Column({ type: "int", default: 1 })
  status_rol!: number;

  constructor(
    id_rol?: number,
    nombre_rol?: string,
    descripcion_rol?: string,
    status_rol?: number
  ) {
    if (id_rol) this.id_rol = id_rol;
    if (nombre_rol) this.nombre_rol = nombre_rol;
    if (descripcion_rol) this.descripcion_rol = descripcion_rol;
    if (status_rol) this.status_rol = status_rol;
  }
}
