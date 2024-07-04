import { Paginable } from "../../core/utils/paginable";
import { Post } from "../entities/post";
import { CategoriesRepository } from "../ports/repositories/categories-repository";
import { PostsRepository } from "../ports/repositories/posts-repository";
import { ResourceNotFoundException } from "./errors/resource-not-found-exception";

type Input = {
  categoryId: string;
  page: number;
  pageSize: number;
};

export class GetCategoryPostsUseCase {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly postsRepository: PostsRepository
  ) {}

  async run({ categoryId, page, pageSize }: Input): Promise<Paginable<Post[]>> {
    const category = await this.categoriesRepository.findById(categoryId);

    if (!category) {
      throw new ResourceNotFoundException();
    }

    const results = await this.postsRepository.findManyByCategoryId(
      categoryId,
      page,
      pageSize
    );

    return results;
  }
}
