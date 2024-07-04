import { Server } from "http";
import request from "supertest";
import { createUser } from "../../../test/integration/helpers/create-user";
import { SQLiteConnection } from "../../application/domain/adapters/repositories/sqlite-connection";
import { UsersSQLiteRepository } from "../../application/domain/adapters/repositories/users-sqlite-repository";
import { GetUserUseCase } from "../../application/domain/use-cases/get-user";
import { adaptRouteHandler } from "../../main/adapter/adapt-route-handler";
import HttpServer from "../lib/http-server";
import { RequestWithUser } from "../lib/types/request";
import { GetUserController } from "./get-user-controller";

describe("Get User Controller (E2E)", () => {
  const url = "/auth/me";
  const connection = new SQLiteConnection(":memory:");
  let usersRepository: UsersSQLiteRepository;
  let getUserUseCase: GetUserUseCase;
  let sut: GetUserController;
  let app: HttpServer;
  let server: Server;

  beforeAll(async () => {
    usersRepository = new UsersSQLiteRepository(connection);
    getUserUseCase = new GetUserUseCase(usersRepository);
    sut = new GetUserController(getUserUseCase);

    app = new HttpServer();

    await createUser(connection, {
      id: "userId-1",
      username: "Samuel Laurindo de Lima",
    });

    app.register(url, [
      {
        path: "/",
        method: "GET",
        middlewares: [
          (req, res, next) => {
            const requestWithUser = req as RequestWithUser;

            const userId = requestWithUser.headers["x-user-id"] as string;

            requestWithUser.userId = userId;

            next();
          },
        ],
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
    const response = await request(server)
      .get(url)
      .set("X-User-Id", "userId-1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: "userId-1",
      username: "Samuel Laurindo de Lima",
    });
  });

  it("should return http status code 404 if user does not exists", async () => {
    const response = await request(server).get(url);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "User not found." });
  });
});
