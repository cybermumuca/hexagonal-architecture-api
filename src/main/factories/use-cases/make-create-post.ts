import { CategoriesSQLiteRepository } from "../../../application/domain/adapters/repositories/categories-sqlite-repository";
import { PostsSQLiteRepository } from "../../../application/domain/adapters/repositories/posts-sqlite-repository";
import { SQLiteConnection } from "../../../application/domain/adapters/repositories/sqlite-connection";
import { CreatePostUseCase } from "../../../application/domain/use-cases/create-post";

export function makeCreatePost(): CreatePostUseCase {
  const connection = new SQLiteConnection();
  const postsRepository = new PostsSQLiteRepository(connection);
  const categoriesRepository = new CategoriesSQLiteRepository(connection);
  return new CreatePostUseCase(categoriesRepository, postsRepository);
}
