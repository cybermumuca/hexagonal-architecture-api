import { Category } from "../entities/category";
import { Post } from "../entities/post";
import { CategoriesRepository } from "../ports/repositories/categories-repository";
import { PostsRepository } from "../ports/repositories/posts-repository";
import { ResourceNotFoundException } from "./errors/resource-not-found-exception";

type Input = {
  content: string;
  categoryIds: string[];
  authorId: string;
};

export class CreatePostUseCase {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly postsRepository: PostsRepository
  ) {}

  async run({ categoryIds, authorId, content }: Input): Promise<Post> {
    const categories = await Promise.all(
      categoryIds.map((categoryId) => {
        return this.categoriesRepository.findById(categoryId);
      })
    );

    categories.forEach((category) => {
      if (!category) {
        throw new ResourceNotFoundException();
      }
    });

    const post = Post.create({
      content,
      authorId,
      categories: categories as Category[],
    });

    await this.postsRepository.store(post);

    return post;
  }
}
