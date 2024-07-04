import { compare, hash } from "bcrypt";
import { CryptographicHash } from "../../ports/cryptography/cryptographic-hash";

export class BcryptHasher implements CryptographicHash {
  async generate(text: string): Promise<string> {
    return await hash(text, 13);
  }

  async compare(text: string, hash: string): Promise<boolean> {
    return await compare(text, hash);
  }
}
