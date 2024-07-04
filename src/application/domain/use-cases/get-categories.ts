import { Paginable } from "../../core/utils/paginable";
import { Category } from "../entities/category";
import { CategoriesRepository } from "../ports/repositories/categories-repository";

type Input = {
  page: number;
  pageSize: number;
};

export class GetCategoriesUseCase {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async run({ page, pageSize }: Input): Promise<Paginable<Category[]>> {
    const results = await this.categoriesRepository.findMany(page, pageSize);

    return results;
  }
}
