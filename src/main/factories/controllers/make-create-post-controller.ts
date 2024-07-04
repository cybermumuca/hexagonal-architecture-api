import { CreatePostController } from "../../../http/controllers/create-post-controller";
import { makeCreatePost } from "../use-cases/make-create-post";

export function makeCreatePostController(): CreatePostController {
  return new CreatePostController(makeCreatePost());
}
