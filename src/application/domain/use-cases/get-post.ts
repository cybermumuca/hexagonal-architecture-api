import { Post } from "../entities/post";
import { PostsRepository } from "../ports/repositories/posts-repository";
import { ResourceNotFoundException } from "./errors/resource-not-found-exception";

type Input = {
  postId: string;
};

export class GetPostUseCase {
  constructor(private readonly postsRepository: PostsRepository) {}

  async run({ postId }: Input): Promise<Post> {
    const post = await this.postsRepository.findById(postId);

    if (!post) {
      throw new ResourceNotFoundException();
    }

    return post;
  }
}
