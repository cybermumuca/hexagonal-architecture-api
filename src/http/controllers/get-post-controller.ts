import { PostPresenter } from "../../application/domain/presenters/post-presenter";
import { ResourceNotFoundException } from "../../application/domain/use-cases/errors/resource-not-found-exception";
import { GetPostUseCase } from "../../application/domain/use-cases/get-post";
import { Request } from "../lib/types/request";
import { Response } from "../lib/types/response";
import { Controller } from "../protocols/controller";

export class GetPostController implements Controller {
  constructor(private readonly getPostUseCase: GetPostUseCase) {}

  async handle(request: Request, response: Response) {
    const { id } = request.params;

    try {
      const post = await this.getPostUseCase.run({ postId: id });
      return response.json(PostPresenter.toHTTP(post));
    } catch (error) {
      if (error instanceof ResourceNotFoundException) {
        return response.status(404).json({ message: "Post not found." });
      }

      throw error;
    }
  }
}
