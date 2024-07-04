import { CredentialsMismatchException } from "../../application/domain/use-cases/errors/credentials-mismatch-exception";
import { SignInUseCase } from "../../application/domain/use-cases/sign-in";
import type { Request } from "../lib/types/request";
import type { Response } from "../lib/types/response";
import { Controller } from "../protocols/controller";

export class SignInController implements Controller {
  constructor(private readonly signInUseCase: SignInUseCase) {}

  async handle(request: Request, response: Response) {
    const { username, password } = request.body;

    try {
      const accessToken = await this.signInUseCase.run({ username, password });

      return response.json({ accessToken });
    } catch (error) {
      if (error instanceof CredentialsMismatchException) {
        return response
          .status(400)
          .json({ message: "Wrong username or password." });
      }

      throw error;
    }
  }
}
