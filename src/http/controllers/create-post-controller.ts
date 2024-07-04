import { PostPresenter } from "../../application/domain/presenters/post-presenter";
import { CreatePostUseCase } from "../../application/domain/use-cases/create-post";
import { ResourceNotFoundException } from "../../application/domain/use-cases/errors/resource-not-found-exception";
import type { RequestWithUser } from "../lib/types/request";
import type { Response } from "../lib/types/response";
import { Controller } from "../protocols/controller";

export class CreatePostController implements Controller {
  constructor(private readonly createPostUseCase: CreatePostUseCase) {}

  async handle(request: RequestWithUser, response: Response) {
    const { content, categoryIds } = request.body;
    const { userId } = request;

    if (!content) {
      return response
        .status(400)
        .json({ message: '"content" field is invalid.' });
    }

    if (!categoryIds || categoryIds.length === 0) {
      return response
        .status(400)
        .json({ message: '"categoryIds" field is invalid.' });
    }

    try {
      const post = await this.createPostUseCase.run({
        authorId: userId,
        content,
        categoryIds,
      });

      response.setHeader("Content-Location", `/posts/${post.id}`);
      return response.status(201).json(PostPresenter.toHTTP(post));
    } catch (error) {
      if (error instanceof ResourceNotFoundException) {
        return response.status(404).json({
          message: "One or more categories do not exist.",
        });
      }

      throw error;
    }
  }
}
