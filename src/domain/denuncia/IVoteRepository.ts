export interface VoteRecord {
  id: number;
  denunciaId: number;
  userId: number;
  value: -1 | 1;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVoteRepository {
  findUserVote(denunciaId: number, userId: number): Promise<VoteRecord | null>;
  upsertVote(denunciaId: number, userId: number, value: -1 | 1): Promise<VoteRecord>;
  deleteVote(denunciaId: number, userId: number): Promise<boolean>;
}
