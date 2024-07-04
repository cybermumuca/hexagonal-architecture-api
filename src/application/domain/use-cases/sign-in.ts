import { CryptographicHash } from "../ports/cryptography/cryptographic-hash";
import { TokenHandler } from "../ports/cryptography/token-handler";
import { UsersRepository } from "../ports/repositories/users-repository";
import { CredentialsMismatchException } from "./errors/credentials-mismatch-exception";

type Input = {
  username: string;
  password: string;
};

export class SignInUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly cryptoHash: CryptographicHash,
    private readonly tokenHandler: TokenHandler
  ) {}

  async run({ username, password }: Input): Promise<string> {
    const user = await this.usersRepository.findByUsername(username);

    if (!user) {
      throw new CredentialsMismatchException();
    }

    const passwordValid = await this.cryptoHash.compare(
      password,
      user.password
    );

    if (!passwordValid) {
      throw new CredentialsMismatchException();
    }

    const accessToken = await this.tokenHandler.encrypt({
      sub: user.id,
    });

    return accessToken;
  }
}
