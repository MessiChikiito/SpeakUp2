export class Categoria {
  constructor(
    public id: number,
    public nombre: string,
    public descripcion: string | null,
    public status: number,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
