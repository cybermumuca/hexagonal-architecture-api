import { GetPostsController } from "../../../http/controllers/get-posts-controller";
import { makeGetPosts } from "../use-cases/make-get-posts";

export function makeGetPostsController(): GetPostsController {
  return new GetPostsController(makeGetPosts());
}
