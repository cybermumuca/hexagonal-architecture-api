import jwt from "jsonwebtoken";
import {
  TokenHandler,
  UserPayload,
} from "../../ports/cryptography/token-handler";

export class JwtHandler implements TokenHandler {
  async decrypt(token: string): Promise<UserPayload> {
    return new Promise((resolve, reject) => {
      const payload = jwt.verify(token, "secret") as UserPayload;
      resolve(payload);
    });
  }

  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return new Promise((resolve, reject) => {
      const token = jwt.sign(payload, "secret");
      resolve(token);
    });
  }
}
