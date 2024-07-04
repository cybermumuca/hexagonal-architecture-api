import { CategoriesSQLiteRepository } from "../../../application/domain/adapters/repositories/categories-sqlite-repository";
import { SQLiteConnection } from "../../../application/domain/adapters/repositories/sqlite-connection";
import { GetCategoryWithPostsUseCase } from "../../../application/domain/use-cases/get-category-with-posts";

export function makeGetCategoryWithPosts(): GetCategoryWithPostsUseCase {
  const categoriesRepository = new CategoriesSQLiteRepository(
    new SQLiteConnection()
  );
  return new GetCategoryWithPostsUseCase(categoriesRepository);
}
