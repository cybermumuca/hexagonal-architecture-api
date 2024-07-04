import { CategoryWithPosts } from "../entities/category-with-posts";
import { CategoriesRepository } from "../ports/repositories/categories-repository";
import { ResourceNotFoundException } from "./errors/resource-not-found-exception";

type Input = {
  categoryId: string;
};

export class GetCategoryWithPostsUseCase {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async run({ categoryId }: Input): Promise<CategoryWithPosts> {
    const categoryWithPosts = await this.categoriesRepository.findWithPostsById(
      categoryId
    );

    if (!categoryWithPosts) {
      throw new ResourceNotFoundException();
    }

    return categoryWithPosts;
  }
}
