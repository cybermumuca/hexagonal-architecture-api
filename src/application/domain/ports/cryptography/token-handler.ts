export interface UserPayload {
  sub: string;
}

export abstract class TokenHandler {
  abstract decrypt(token: string): Promise<UserPayload>;
  abstract encrypt(payload: Record<string, unknown>): Promise<string>;
}
