import { Server } from "http";
import request from "supertest";
import { createUser } from "../../../test/integration/helpers/create-user";
import { SQLiteConnection } from "../../application/domain/adapters/repositories/sqlite-connection";
import { UsersSQLiteRepository } from "../../application/domain/adapters/repositories/users-sqlite-repository";
import { adaptRouteHandler } from "../../main/adapter/adapt-route-handler";
import HttpServer from "../lib/http-server";
import { SignInController } from "./sign-in-controller";
import { SignInUseCase } from "../../application/domain/use-cases/sign-in";
import { BcryptHasher } from "../../application/domain/adapters/cryptography/bcrypt-hasher";
import { JwtHandler } from "../../application/domain/adapters/cryptography/jwt-handler";

describe("Sign In Controller (E2E)", () => {
  const url = "/auth/signin";
  const connection = new SQLiteConnection(":memory:");
  let usersRepository: UsersSQLiteRepository;
  let cryptographicHash: BcryptHasher;
  let tokenHandler: JwtHandler;
  let signInUseCase: SignInUseCase;
  let sut: SignInController;
  let app: HttpServer;
  let server: Server;

  beforeAll(async () => {
    usersRepository = new UsersSQLiteRepository(connection);
    cryptographicHash = new BcryptHasher();
    tokenHandler = new JwtHandler();
    signInUseCase = new SignInUseCase(
      usersRepository,
      cryptographicHash,
      tokenHandler
    );
    sut = new SignInController(signInUseCase);

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

  it("should get an user and return http status code 200", async () => {
    await createUser(connection, {
      id: "userId-1",
      username: "laurindosamuel",
      password: await cryptographicHash.generate("12345678"),
    });

    const response = await request(server).post(url).send({
      username: "laurindosamuel",
      password: "12345678",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      accessToken: expect.any(String),
    });
  });

  it("should return http status code 400 if username or password is wrong", async () => {
    const response = await request(server).post(url).send({
      username: "randomUser",
      password: "randomPass",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Wrong username or password." });
  });
});
