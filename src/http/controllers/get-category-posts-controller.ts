import { PostPresenter } from "../../application/domain/presenters/post-presenter";
import { ResourceNotFoundException } from "../../application/domain/use-cases/errors/resource-not-found-exception";
import { GetCategoryPostsUseCase } from "../../application/domain/use-cases/get-category-posts";
import type { Request } from "../lib/types/request";
import type { Response } from "../lib/types/response";
import { Controller } from "../protocols/controller";

export class GetCategoryPostsController implements Controller {
  constructor(
    private readonly getCategoryPostsUseCase: GetCategoryPostsUseCase
  ) {}

  async handle(request: Request, response: Response) {
    const { id } = request.params;
    let { page, size } = request.query;

    const pageNumber = page ? parseInt(page as string, 10) : 1;
    const pageSizeNumber = size ? parseInt(size as string, 10) : 10;

    if (!Number.isInteger(pageNumber) || !Number.isInteger(pageSizeNumber)) {
      return response
        .status(400)
        .json({ error: "Page and size must be integers" });
    }

    if (pageNumber < 1 || pageSizeNumber < 1) {
      return response
        .status(400)
        .json({ error: "Page and size must be greater than 0" });
    }

    try {
      const { results, length, total } = await this.getCategoryPostsUseCase.run(
        {
          categoryId: id,
          page: pageNumber,
          pageSize: pageSizeNumber,
        }
      );

      const statusCode = length === 0 ? 204 : 200;

      return response.status(statusCode).json({
        results: results.map(PostPresenter.toHTTP),
        length,
        page: pageNumber,
        pageSize: pageSizeNumber,
        total,
      });
    } catch (error) {
      if (error instanceof ResourceNotFoundException) {
        return response.status(404).json({ message: "Category not found." });
      }

      throw error;
    }
  }
}
