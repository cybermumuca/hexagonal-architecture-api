import { UsersMemoryRepository } from "../../../../test/adapters/repositories/users-memory-repository";
import { User } from "../entities/user";
import { ResourceNotFoundException } from "./errors/resource-not-found-exception";
import { GetUserUseCase } from "./get-user";

describe("Get User", () => {
  let usersRepository: UsersMemoryRepository;
  let sut: GetUserUseCase;

  beforeEach(() => {
    usersRepository = new UsersMemoryRepository();
    sut = new GetUserUseCase(usersRepository);
  });

  it("should get an user", async () => {
    const user = User.create(
      {
        username: "test-username",
        password: "test-password",
      },
      "userId-1"
    );

    usersRepository.items.push(user);

    const result = await sut.run({ userId: user.id });

    expect(result).toEqual(usersRepository.items[0]);
    expect(result.id).toEqual("userId-1");
    expect(result.username).toEqual("test-username");
    expect(result.password).toEqual("test-password");
  });

  it("should throw an exception if user does not exists", async () => {
    await expect(sut.run({ userId: "randomId" })).rejects.toBeInstanceOf(
      ResourceNotFoundException
    );
  });
});
