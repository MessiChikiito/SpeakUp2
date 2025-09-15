import { Categoria } from "./Categoria";

export interface ICategoriaRepository {
  createCategoria(categoria: Omit<Categoria, "id" | "createdAt" | "updatedAt">): Promise<number>;
  updateCategoria(id: number, categoria: Partial<Omit<Categoria, "id">>): Promise<boolean>;
  deleteCategoria(id: number): Promise<boolean>;
  getCategoriaById(id: number): Promise<Categoria | null>;
  getAllCategorias(): Promise<Categoria[]>;
}
