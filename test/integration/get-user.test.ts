import { SQLiteConnection } from "../../src/application/domain/adapters/repositories/sqlite-connection";
import { UsersSQLiteRepository } from "../../src/application/domain/adapters/repositories/users-sqlite-repository";
import { User } from "../../src/application/domain/entities/user";
import { ResourceNotFoundException } from "../../src/application/domain/use-cases/errors/resource-not-found-exception";
import { GetUserUseCase } from "../../src/application/domain/use-cases/get-user";

describe("Get User (Integration)", () => {
  const connection = new SQLiteConnection(":memory:");
  let usersRepository: UsersSQLiteRepository;
  let sut: GetUserUseCase;

  beforeAll(() => {
    usersRepository = new UsersSQLiteRepository(connection);
    sut = new GetUserUseCase(usersRepository);
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should get an user", async () => {
    const user = User.create(
      {
        username: "test-username",
        password: "test-password",
      },
      "userId-1"
    );

    await usersRepository.store(user);

    const result = await sut.run({ userId: user.id });

    const userInDB = await usersRepository.findById(user.id);

    expect(result).toEqual(userInDB);
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
