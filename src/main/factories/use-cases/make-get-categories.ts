import { CategoriesSQLiteRepository } from "../../../application/domain/adapters/repositories/categories-sqlite-repository";
import { SQLiteConnection } from "../../../application/domain/adapters/repositories/sqlite-connection";
import { GetCategoriesUseCase } from "../../../application/domain/use-cases/get-categories";

export function makeGetCategories(): GetCategoriesUseCase {
  const categoriesRepository = new CategoriesSQLiteRepository(
    new SQLiteConnection()
  );
  return new GetCategoriesUseCase(categoriesRepository);
}
