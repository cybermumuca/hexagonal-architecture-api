import { Category } from "../entities/category";
import { CategoriesRepository } from "../ports/repositories/categories-repository";
import { ResourceNotFoundException } from "./errors/resource-not-found-exception";

type Input = {
  categoryId: string;
};

export class GetCategoryUseCase {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async run({ categoryId }: Input): Promise<Category> {
    const category = await this.categoriesRepository.findById(categoryId);

    if (!category) {
      throw new ResourceNotFoundException();
    }

    return category;
  }
}
