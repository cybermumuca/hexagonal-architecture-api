import {
  TokenHandler,
  UserPayload,
} from "../../../src/application/domain/ports/cryptography/token-handler";

export class FakeTokenHandler implements TokenHandler {
  async decrypt(token: string): Promise<UserPayload> {
    return { sub: token };
  }

  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload);
  }
}
