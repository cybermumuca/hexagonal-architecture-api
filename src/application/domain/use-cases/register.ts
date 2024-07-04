import { User } from "../entities/user";
import { CryptographicHash } from "../ports/cryptography/cryptographic-hash";
import { UsersRepository } from "../ports/repositories/users-repository";
import { UserAlreadyExistsException } from "./errors/user-already-exists-exception";

type Input = {
  username: string;
  password: string;
};

export class RegisterUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly cryptoHash: CryptographicHash
  ) {}

  async run({ username, password }: Input): Promise<void> {
    const userAlreadyExists = await this.usersRepository.findByUsername(
      username
    );

    if (userAlreadyExists) {
      throw new UserAlreadyExistsException();
    }

    const hashedPassword = await this.cryptoHash.generate(password);

    const user = User.create({
      username,
      password: hashedPassword,
    });

    await this.usersRepository.store(user);
  }
}
