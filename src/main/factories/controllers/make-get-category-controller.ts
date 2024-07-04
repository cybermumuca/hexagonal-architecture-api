import { GetCategoryController } from "../../../http/controllers/get-category-controller";
import { makeGetCategory } from "../use-cases/make-get-category";
import { makeGetCategoryWithPosts } from "../use-cases/make-get-category-with-posts";

export function makeGetCategoryController(): GetCategoryController {
  return new GetCategoryController(
    makeGetCategory(),
    makeGetCategoryWithPosts()
  );
}
