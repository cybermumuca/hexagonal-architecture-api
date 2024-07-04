import { Server } from "http";
import request from "supertest";
import { createUser } from "../../../test/integration/helpers/create-user";
import { CategoriesSQLiteRepository } from "../../application/domain/adapters/repositories/categories-sqlite-repository";
import { PostsSQLiteRepository } from "../../application/domain/adapters/repositories/posts-sqlite-repository";
import { SQLiteConnection } from "../../application/domain/adapters/repositories/sqlite-connection";
import { Category } from "../../application/domain/entities/category";
import { CreatePostUseCase } from "../../application/domain/use-cases/create-post";
import { adaptRouteHandler } from "../../main/adapter/adapt-route-handler";
import HttpServer from "../lib/http-server";
import { RequestWithUser } from "../lib/types/request";
import { CreatePostController } from "./create-post-controller";

describe("Create Post Controller (E2E)", () => {
  const url = "/posts";
  const connection = new SQLiteConnection(":memory:");
  let categoriesRepository: CategoriesSQLiteRepository;
  let postsRepository: PostsSQLiteRepository;
  let createPostUseCase: CreatePostUseCase;
  let sut: CreatePostController;
  let app: HttpServer;
  let server: Server;

  beforeAll(async () => {
    categoriesRepository = new CategoriesSQLiteRepository(connection);
    postsRepository = new PostsSQLiteRepository(connection);
    createPostUseCase = new CreatePostUseCase(
      categoriesRepository,
      postsRepository
    );
    sut = new CreatePostController(createPostUseCase);

    app = new HttpServer();

    await createUser(connection, { id: "userId-1" });

    await categoriesRepository.store(
      Category.create({ name: "Testing" }, "categoryId-1")
    );

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

  it("should create a post and return http status code 201", async () => {
    const response = await request(server)
      .post(url)
      .send({
        content: "Test Post",
        categoryIds: ["categoryId-1"],
      });

    expect(response.status).toBe(201);
    expect(response.body.id).toEqual(expect.any(String));
    expect(response.body.content).toEqual("Test Post");
    expect(response.body.authorId).toEqual("userId-1");
    expect(response.body.categories).toEqual([
      { id: "categoryId-1", name: "Testing" },
    ]);
    expect(response.headers["content-location"]).toEqual(
      `${url}/${response.body.id}`
    );
  });

  it("should return http status code 404 if category does not exists", async () => {
    const response = await request(server)
      .post(url)
      .send({
        content: "Test Post 2",
        categoryIds: ["randomId"],
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "One or more categories do not exist.",
    });
  });
});
