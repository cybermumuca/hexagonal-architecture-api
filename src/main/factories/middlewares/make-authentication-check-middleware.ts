import { JwtHandler } from "../../../application/domain/adapters/cryptography/jwt-handler";
import { AuthenticationCheckMiddleware } from "../../../http/middlewares/authentication-check";

export function makeAuthenticationCheckMiddleware(): AuthenticationCheckMiddleware {
  const tokenHandler = new JwtHandler();
  return new AuthenticationCheckMiddleware(tokenHandler);
}
