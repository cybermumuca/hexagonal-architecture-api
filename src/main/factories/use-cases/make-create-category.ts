import { CategoriesSQLiteRepository } from "../../../application/domain/adapters/repositories/categories-sqlite-repository";
import { SQLiteConnection } from "../../../application/domain/adapters/repositories/sqlite-connection";
import { CreateCategoryUseCase } from "../../../application/domain/use-cases/create-category";

export function makeCreateCategory(): CreateCategoryUseCase {
  const categoriesRepository = new CategoriesSQLiteRepository(
    new SQLiteConnection()
  );
  return new CreateCategoryUseCase(categoriesRepository);
}
