import { FakeCryptographicHash } from "../../../../test/adapters/cryptography/fake-cryptographic-hash";
import { UsersMemoryRepository } from "../../../../test/adapters/repositories/users-memory-repository";
import { User } from "../entities/user";
import { UserAlreadyExistsException } from "./errors/user-already-exists-exception";
import { RegisterUseCase } from "./register";

describe("Register", () => {
  let usersRepository: UsersMemoryRepository;
  let cryptographicHash: FakeCryptographicHash;
  let sut: RegisterUseCase;

  beforeEach(() => {
    usersRepository = new UsersMemoryRepository();
    cryptographicHash = new FakeCryptographicHash();
    sut = new RegisterUseCase(usersRepository, cryptographicHash);
  });

  it("should register an user", async () => {
    await sut.run({
      username: "joaozinho",
      password: "joaozinho69",
    });

    expect(usersRepository.items).toHaveLength(1);
    expect(usersRepository.items[0].id).toEqual(expect.any(String));
    expect(usersRepository.items[0].username).toEqual("joaozinho");
    expect(usersRepository.items[0].password).toBeDefined();
  });

  it("should throw an exception if user already exists", async () => {
    const user = User.create({
      username: "joaozinho",
      password: "aaaa",
    });

    usersRepository.items.push(user);

    await expect(
      sut.run({
        username: "joaozinho",
        password: "joaozinho69",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsException);
  });
});
