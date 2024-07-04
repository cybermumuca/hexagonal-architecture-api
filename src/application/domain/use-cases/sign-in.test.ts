import { FakeCryptographicHash } from "../../../../test/adapters/cryptography/fake-cryptographic-hash";
import { FakeTokenHandler } from "../../../../test/adapters/cryptography/fake-token-handler";
import { UsersMemoryRepository } from "../../../../test/adapters/repositories/users-memory-repository";
import { User } from "../entities/user";
import { CredentialsMismatchException } from "./errors/credentials-mismatch-exception";
import { SignInUseCase } from "./sign-in";

describe("Sign In", () => {
  let usersRepository: UsersMemoryRepository;
  let cryptographicHash: FakeCryptographicHash;
  let tokenHandler: FakeTokenHandler;
  let sut: SignInUseCase;

  beforeEach(() => {
    usersRepository = new UsersMemoryRepository();
    cryptographicHash = new FakeCryptographicHash();
    tokenHandler = new FakeTokenHandler();
    sut = new SignInUseCase(usersRepository, cryptographicHash, tokenHandler);
  });

  it("should sign in", async () => {
    const user = User.create({
      username: "joaozinho",
      password: await cryptographicHash.generate("joaozinho69"),
    });

    usersRepository.items.push(user);

    const accessToken = await sut.run({
      username: "joaozinho",
      password: "joaozinho69",
    });

    expect(accessToken).toEqual(expect.any(String));
  });

  it("should throw an exception if user does not exists", async () => {
    await expect(
      sut.run({
        username: "joaozinho",
        password: "joaozinho69",
      })
    ).rejects.toBeInstanceOf(CredentialsMismatchException);
  });

  it("should throw an exception if password is wrong", async () => {
    const user = User.create({
      username: "joaozinho",
      password: "123456789",
    });

    usersRepository.items.push(user);

    await expect(
      sut.run({
        username: "joaozinho",
        password: "joaozinho69",
      })
    ).rejects.toBeInstanceOf(CredentialsMismatchException);
  });
});
