import { UserAlreadyExistsException } from "../../application/domain/use-cases/errors/user-already-exists-exception";
import { RegisterUseCase } from "../../application/domain/use-cases/register";
import type { Request } from "../lib/types/request";
import type { Response } from "../lib/types/response";
import { Controller } from "../protocols/controller";

export class RegisterController implements Controller {
  constructor(private readonly registerUseCase: RegisterUseCase) {}

  async handle(request: Request, response: Response) {
    const { username, password } = request.body;

    if (!username) {
      return response.status(400).json({ message: "Invalid username." });
    }

    if (!password) {
      return response.status(400).json({ message: "Invalid password." });
    }

    try {
      await this.registerUseCase.run({ username, password });

      return response
        .status(201)
        .json({ message: "User registered successfully." });
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) {
        return response.status(409).json({ message: "User already exists." });
      }

      throw error;
    }
  }
}
