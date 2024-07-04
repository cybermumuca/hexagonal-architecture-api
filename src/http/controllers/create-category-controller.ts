import { CategoryPresenter } from "../../application/domain/presenters/category-presenter";
import { CreateCategoryUseCase } from "../../application/domain/use-cases/create-category";
import { ResourceAlreadyExistsException } from "../../application/domain/use-cases/errors/resource-already-exists-exception";
import { RequestWithUser } from "../lib/types/request";
import { Response } from "../lib/types/response";
import { Controller } from "../protocols/controller";

export class CreateCategoryController implements Controller {
  constructor(private readonly createCategoryUseCase: CreateCategoryUseCase) {}

  async handle(request: RequestWithUser, response: Response) {
    const { name } = request.body;

    if (!name || typeof name !== "string") {
      return response.status(400).json({ message: '"name" field is invalid.' });
    }

    try {
      const category = await this.createCategoryUseCase.run({ name });

      response.setHeader("Content-Location", `/categories/${category.id}`);
      return response.status(201).json(CategoryPresenter.toHTTP(category));
    } catch (error) {
      if (error instanceof ResourceAlreadyExistsException) {
        return response
          .status(409)
          .json({ message: "Category already exists." });
      }

      throw error;
    }
  }
}
