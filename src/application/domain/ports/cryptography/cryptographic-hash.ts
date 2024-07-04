export abstract class CryptographicHash {
  abstract generate(text: string): Promise<string>;
  abstract compare(text: string, hash: string): Promise<boolean>;
}
