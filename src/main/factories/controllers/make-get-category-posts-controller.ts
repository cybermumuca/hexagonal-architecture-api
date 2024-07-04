import { GetCategoryPostsController } from "../../../http/controllers/get-category-posts-controller";
import { makeGetCategoryPosts } from "../use-cases/make-get-category-posts";

export function makeGetCategoryPostsController() {
  return new GetCategoryPostsController(makeGetCategoryPosts());
}
