import { CategoriesSQLiteRepository } from "../../../application/domain/adapters/repositories/categories-sqlite-repository";
import { PostsSQLiteRepository } from "../../../application/domain/adapters/repositories/posts-sqlite-repository";
import { SQLiteConnection } from "../../../application/domain/adapters/repositories/sqlite-connection";
import { GetCategoryPostsUseCase } from "../../../application/domain/use-cases/get-category-posts";

export function makeGetCategoryPosts() {
  const connection = new SQLiteConnection();
  const postsRepository = new PostsSQLiteRepository(connection);
  const categoriesRepository = new CategoriesSQLiteRepository(connection);
  return new GetCategoryPostsUseCase(categoriesRepository, postsRepository);
}
