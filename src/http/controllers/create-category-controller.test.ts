import { Server } from "http";
import request from "supertest";
import { createUser } from "../../../test/integration/helpers/create-user";
import { CategoriesSQLiteRepository } from "../../application/domain/adapters/repositories/categories-sqlite-repository";
import { SQLiteConnection } from "../../application/domain/adapters/repositories/sqlite-connection";
import { CreateCategoryUseCase } from "../../application/domain/use-cases/create-category";
import { adaptRouteHandler } from "../../main/adapter/adapt-route-handler";
import HttpServer from "../lib/http-server";
import { RequestWithUser } from "../lib/types/request";
import { CreateCategoryController } from "./create-category-controller";

describe("Create Category Controller (E2E)", () => {
  const url = "/categories";
  const connection = new SQLiteConnection(":memory:");
  let categoriesRepository: CategoriesSQLiteRepository;
  let createCategoryUseCase: CreateCategoryUseCase;
  let sut: CreateCategoryController;
  let app: HttpServer;
  let server: Server;

  beforeAll(async () => {
    categoriesRepository = new CategoriesSQLiteRepository(connection);
    createCategoryUseCase = new CreateCategoryUseCase(categoriesRepository);
    sut = new CreateCategoryController(createCategoryUseCase);

    app = new HttpServer();

    await createUser(connection, { id: "userId-1" });

    app.register(url, [
      {
        path: "/",
        method: "POST",
        middlewares: [
          (req, res, next) => {
            const requestWithUser = req as RequestWithUser;

            requestWithUser.userId = "userId-1";
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

  it("should create a category and return http status code 201", async () => {
    const response = await request(server).post(url).send({
      name: "Test Category",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: expect.any(String),
      name: "Test Category",
    });
    expect(response.headers["content-location"]).toEqual(
      `${url}/${response.body.id}`
    );
  });

  it("should return http status code 409 if category already exists", async () => {
    const response = await request(server).post(url).send({
      name: "Test Category",
    });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ message: "Category already exists." });
  });
});
