import { UserPresenter } from "../../application/domain/presenters/user-presenter";
import { ResourceNotFoundException } from "../../application/domain/use-cases/errors/resource-not-found-exception";
import { GetUserUseCase } from "../../application/domain/use-cases/get-user";
import { RequestWithUser } from "../lib/types/request";
import { Response } from "../lib/types/response";
import { Controller } from "../protocols/controller";

export class GetUserController implements Controller {
  constructor(private readonly getUserUseCase: GetUserUseCase) {}

  async handle(request: RequestWithUser, response: Response) {
    const { userId } = request;

    try {
      const user = await this.getUserUseCase.run({ userId });
      return response.json(UserPresenter.toHTTP(user));
    } catch (error) {
      if (error instanceof ResourceNotFoundException) {
        return response.status(404).json({ message: "User not found." });
      }

      throw error;
    }
  }
}
