import { BcryptHasher } from "../../src/application/domain/adapters/cryptography/bcrypt-hasher";
import { SQLiteConnection } from "../../src/application/domain/adapters/repositories/sqlite-connection";
import { UsersSQLiteRepository } from "../../src/application/domain/adapters/repositories/users-sqlite-repository";
import { User } from "../../src/application/domain/entities/user";
import { UserAlreadyExistsException } from "../../src/application/domain/use-cases/errors/user-already-exists-exception";
import { RegisterUseCase } from "../../src/application/domain/use-cases/register";

describe("Register (Integration)", () => {
  const connection = new SQLiteConnection(":memory:");
  let usersRepository: UsersSQLiteRepository;
  let cryptographicHash: BcryptHasher;
  let sut: RegisterUseCase;

  beforeAll(() => {
    usersRepository = new UsersSQLiteRepository(connection);
    cryptographicHash = new BcryptHasher();
    sut = new RegisterUseCase(usersRepository, cryptographicHash);
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should register an user", async () => {
    await sut.run({
      username: "joaozinho",
      password: "joaozinho69",
    });

    const user = (await usersRepository.findByUsername("joaozinho")) as User;

    expect(user.id).toBeDefined();
    expect(user.username).toEqual("joaozinho");
    expect(user.password).toBeDefined();
  });

  it("should throw an exception if user already exists", async () => {
    const user = User.create({
      username: "joaozinho2",
      password: "aaaa",
    });

    await usersRepository.store(user);

    await expect(
      sut.run({
        username: "joaozinho2",
        password: "joaozinho69",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsException);
  });
});
