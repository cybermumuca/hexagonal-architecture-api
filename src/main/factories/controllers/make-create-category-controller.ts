import { CreateCategoryController } from "../../../http/controllers/create-category-controller";
import { makeCreateCategory } from "../use-cases/make-create-category";

export function makeCreateCategoryController(): CreateCategoryController {
  return new CreateCategoryController(makeCreateCategory());
}
