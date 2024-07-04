import { BcryptHasher } from "../../src/application/domain/adapters/cryptography/bcrypt-hasher";
import { JwtHandler } from "../../src/application/domain/adapters/cryptography/jwt-handler";
import { SQLiteConnection } from "../../src/application/domain/adapters/repositories/sqlite-connection";
import { UsersSQLiteRepository } from "../../src/application/domain/adapters/repositories/users-sqlite-repository";
import { User } from "../../src/application/domain/entities/user";
import { CredentialsMismatchException } from "../../src/application/domain/use-cases/errors/credentials-mismatch-exception";
import { SignInUseCase } from "../../src/application/domain/use-cases/sign-in";

describe("Sign In (Integration)", () => {
  const connection = new SQLiteConnection(":memory:");
  let usersRepository: UsersSQLiteRepository;
  let cryptographicHash: BcryptHasher;
  let tokenHandler: JwtHandler;
  let sut: SignInUseCase;

  beforeAll(() => {
    usersRepository = new UsersSQLiteRepository(connection);
    cryptographicHash = new BcryptHasher();
    tokenHandler = new JwtHandler();
    sut = new SignInUseCase(usersRepository, cryptographicHash, tokenHandler);
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should sign in", async () => {
    const user = User.create({
      username: "joaozinho",
      password: await cryptographicHash.generate("joaozinho69"),
    });

    await usersRepository.store(user);

    const accessToken = await sut.run({
      username: "joaozinho",
      password: "joaozinho69",
    });

    expect(accessToken).toEqual(expect.any(String));
  });

  it("should throw an exception if user does not exists", async () => {
    await expect(
      sut.run({
        username: "aaaaaa",
        password: "joaozinho69",
      })
    ).rejects.toBeInstanceOf(CredentialsMismatchException);
  });

  it("should throw an exception if password is wrong", async () => {
    const user = User.create({
      username: "joaozinho2",
      password: "123456789",
    });

    await usersRepository.store(user);

    await expect(
      sut.run({
        username: "joaozinho2",
        password: "joaozinho69",
      })
    ).rejects.toBeInstanceOf(CredentialsMismatchException);
  });
});
