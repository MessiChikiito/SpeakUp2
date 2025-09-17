// Placeholder TypeORM-like entity (adjust decorators if using TypeORM)
export class DenunciaVoteEntity {
  id!: number;
  denunciaId!: number;
  userId!: number;
  value!: number; // -1 | 1
  createdAt!: Date;
  updatedAt!: Date;
}
