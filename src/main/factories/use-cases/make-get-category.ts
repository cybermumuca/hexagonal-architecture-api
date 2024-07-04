import { CategoriesSQLiteRepository } from "../../../application/domain/adapters/repositories/categories-sqlite-repository";
import { SQLiteConnection } from "../../../application/domain/adapters/repositories/sqlite-connection";
import { GetCategoryUseCase } from "../../../application/domain/use-cases/get-category";

export function makeGetCategory(): GetCategoryUseCase {
  const categoriesRepository = new CategoriesSQLiteRepository(
    new SQLiteConnection()
  );
  return new GetCategoryUseCase(categoriesRepository);
}
