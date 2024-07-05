import { Server } from "http";
import request from "supertest";
import { createUser } from "../../../test/integration/helpers/create-user";
import { SQLiteConnection } from "../../application/domain/adapters/repositories/sqlite-connection";
import { UsersSQLiteRepository } from "../../application/domain/adapters/repositories/users-sqlite-repository";
import { adaptRouteHandler } from "../../main/adapter/adapt-route-handler";
import HttpServer from "../lib/http-server";
import { BcryptHasher } from "../../application/domain/adapters/cryptography/bcrypt-hasher";
import { RegisterController } from "./register-controller";
import { RegisterUseCase } from "../../application/domain/use-cases/register";

describe("Register Controller (E2E)", () => {
  const url = "/auth/register";
  const connection = new SQLiteConnection(":memory:");
  let usersRepository: UsersSQLiteRepository;
  let cryptographicHash: BcryptHasher;
  let registerUseCase: RegisterUseCase;
  let sut: RegisterController;
  let app: HttpServer;
  let server: Server;

  beforeAll(async () => {
    usersRepository = new UsersSQLiteRepository(connection);
    cryptographicHash = new BcryptHasher();
    registerUseCase = new RegisterUseCase(usersRepository, cryptographicHash);
    sut = new RegisterController(registerUseCase);

    app = new HttpServer();

    app.register(url, [
      {
        path: "/",
        method: "POST",
        handler: adaptRouteHandler(sut),
      },
    ]);

    server = app.listen(0);
  });

  afterAll(async () => {
    await connection.close();
    server.close();
  });

  it("should register an user and return http status code 201", async () => {
    const response = await request(server).post(url).send({
      username: "laurindosamuel",
      password: "12345678",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: "User registered successfully." });
  });

  it("should return http status code 409 if user already exists", async () => {
    await createUser(connection, {
      id: "userId-1",
      username: "randomUser",
      password: await cryptographicHash.generate("12345678"),
    });

    const response = await request(server).post(url).send({
      username: "randomUser",
      password: "randomPass",
    });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ message: "User already exists." });
  });
});
