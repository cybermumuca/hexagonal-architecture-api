import { Paginable } from "../../core/utils/paginable";
import { Post } from "../entities/post";
import { PostsRepository } from "../ports/repositories/posts-repository";

type Input = {
  page: number;
  pageSize: number;
};

export class GetPostsUseCase {
  constructor(private readonly postsRepository: PostsRepository) {}

  async run({ page, pageSize }: Input): Promise<Paginable<Post[]>> {
    const results = await this.postsRepository.findMany(page, pageSize);

    return results;
  }
}
