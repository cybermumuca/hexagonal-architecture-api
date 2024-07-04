import { PostsSQLiteRepository } from "../../../application/domain/adapters/repositories/posts-sqlite-repository";
import { SQLiteConnection } from "../../../application/domain/adapters/repositories/sqlite-connection";
import { GetPostsUseCase } from "../../../application/domain/use-cases/get-posts";

export function makeGetPosts(): GetPostsUseCase {
  const postsRepository = new PostsSQLiteRepository(new SQLiteConnection());
  return new GetPostsUseCase(postsRepository);
}
