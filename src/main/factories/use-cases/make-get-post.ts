import { PostsSQLiteRepository } from "../../../application/domain/adapters/repositories/posts-sqlite-repository";
import { SQLiteConnection } from "../../../application/domain/adapters/repositories/sqlite-connection";
import { GetPostUseCase } from "../../../application/domain/use-cases/get-post";

export function makeGetPost(): GetPostUseCase {
  const postsRepository = new PostsSQLiteRepository(new SQLiteConnection());
  return new GetPostUseCase(postsRepository);
}
