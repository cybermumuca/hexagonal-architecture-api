import { CategoryPresenter } from "../../application/domain/presenters/category-presenter";
import { CategoryWithPostsPresenter } from "../../application/domain/presenters/category-with-posts-presenter";
import { ResourceNotFoundException } from "../../application/domain/use-cases/errors/resource-not-found-exception";
import { GetCategoryUseCase } from "../../application/domain/use-cases/get-category";
import { GetCategoryWithPostsUseCase } from "../../application/domain/use-cases/get-category-with-posts";
import type { Request } from "../lib/types/request";
import type { Response } from "../lib/types/response";
import { Controller } from "../protocols/controller";

export class GetCategoryController implements Controller {
  constructor(
    private readonly getCategoryUseCase: GetCategoryUseCase,
    private readonly getCategoryWithPostsUseCase: GetCategoryWithPostsUseCase
  ) {}

  async handle(request: Request, response: Response) {
    const { id } = request.params;
    const { includePost = false } = request.query;

    try {
      if (includePost && includePost === "true") {
        const categoriesWithPosts = await this.getCategoryWithPostsUseCase.run({
          categoryId: id,
        });

        return response.json(
          CategoryWithPostsPresenter.toHTTP(categoriesWithPosts)
        );
      }

      const category = await this.getCategoryUseCase.run({ categoryId: id });
      return response.json(CategoryPresenter.toHTTP(category));
    } catch (error) {
      if (error instanceof ResourceNotFoundException) {
        return response.status(404).json({ message: "Category not found." });
      }

      throw error;
    }
  }
}
