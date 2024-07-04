import { TokenHandler } from "../../application/domain/ports/cryptography/token-handler";
import { NextFunction } from "../lib/types/next-function";
import type { Request, RequestWithUser } from "../lib/types/request";
import type { Response } from "../lib/types/response";
import { Middleware } from "../protocols/middleware";

export class AuthenticationCheckMiddleware implements Middleware {
  constructor(private readonly tokenHandler: TokenHandler) {}

  async handle(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      return response.status(401).json({ message: "Token not found." });
    }

    try {
      const { sub } = await this.tokenHandler.decrypt(token);

      const requestWithUser = request as RequestWithUser;

      requestWithUser.userId = sub;
      next();
    } catch (error) {
      return response.status(401).json({ message: "Invalid token." });
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
