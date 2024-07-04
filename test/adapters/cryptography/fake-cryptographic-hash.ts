import { CryptographicHash } from "../../../src/application/domain/ports/cryptography/cryptographic-hash";

export class FakeCryptographicHash implements CryptographicHash {
  async generate(text: string): Promise<string> {
    return text.concat("-hashed");
  }

  async compare(text: string, hash: string): Promise<boolean> {
    return text.concat("-hashed") === hash;
  }
}
