import { GetCategoriesController } from "../../../http/controllers/get-categories-controller";
import { makeGetCategories } from "../use-cases/make-get-categories";

export function makeGetCategoriesController(): GetCategoriesController {
  return new GetCategoriesController(makeGetCategories());
}
