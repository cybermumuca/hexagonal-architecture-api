import { CategoryPresenter } from "../../application/domain/presenters/category-presenter";
import { GetCategoriesUseCase } from "../../application/domain/use-cases/get-categories";
import type { Request } from "../lib/types/request";
import type { Response } from "../lib/types/response";
import { Controller } from "../protocols/controller";

export class GetCategoriesController implements Controller {
  constructor(private readonly getCategoriesUseCase: GetCategoriesUseCase) {}

  async handle(request: Request, response: Response) {
    let { page, size } = request.query;

    const pageNumber = page ? parseInt(page as string, 10) : 1;
    const pageSizeNumber = size ? parseInt(size as string, 10) : 10;

    if (!Number.isInteger(pageNumber) || !Number.isInteger(pageSizeNumber)) {
      return response
        .status(400)
        .json({ message: "Page and size must be integers." });
    }

    if (pageNumber < 1 || pageSizeNumber < 1) {
      return response
        .status(400)
        .json({ message: "Page and size must be greater than 0." });
    }

    const { results, length, total } = await this.getCategoriesUseCase.run({
      page: pageNumber,
      pageSize: pageSizeNumber,
    });

    const statusCode = length === 0 ? 204 : 200;

    return response.status(statusCode).json({
      results: results.map(CategoryPresenter.toHTTP),
      length,
      page: pageNumber,
      pageSize: pageSizeNumber,
      total,
    });
  }
}
