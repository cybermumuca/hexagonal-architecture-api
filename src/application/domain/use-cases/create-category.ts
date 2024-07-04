import { Category } from "../entities/category";
import { CategoriesRepository } from "../ports/repositories/categories-repository";
import { ResourceAlreadyExistsException } from "./errors/resource-already-exists-exception";

type Input = {
  name: string;
};

export class CreateCategoryUseCase {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async run({ name }: Input): Promise<Category> {
    const categoryAlreadyExists = await this.categoriesRepository.findByName(
      name
    );

    if (categoryAlreadyExists) {
      throw new ResourceAlreadyExistsException();
    }

    const category = Category.create({
      name,
    });

    await this.categoriesRepository.store(category);

    return category;
  }
}
