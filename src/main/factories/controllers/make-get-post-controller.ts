import { GetPostController } from "../../../http/controllers/get-post-controller";
import { makeGetPost } from "../use-cases/make-get-post";

export function makeGetPostController(): GetPostController {
  return new GetPostController(makeGetPost());
}
