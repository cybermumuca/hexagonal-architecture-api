import { Server } from "http";
import request from "supertest";
import { CategoriesSQLiteRepository } from "../../application/domain/adapters/repositories/categories-sqlite-repository";
import { SQLiteConnection } from "../../application/domain/adapters/repositories/sqlite-connection";
import { Category } from "../../application/domain/entities/category";
import { GetCategoryUseCase } from "../../application/domain/use-cases/get-category";
import { GetCategoryWithPostsUseCase } from "../../application/domain/use-cases/get-category-with-posts";
import { adaptRouteHandler } from "../../main/adapter/adapt-route-handler";
import HttpServer from "../lib/http-server";
import { GetCategoryController } from "./get-category-controller";

describe("Get Category Controller (E2E)", () => {
  const url = "/categories";
  const connection = new SQLiteConnection(":memory:");
  let categoriesRepository: CategoriesSQLiteRepository;
  let getCategoryUseCase: GetCategoryUseCase;
  let getCategoryWithPostsUseCase: GetCategoryWithPostsUseCase;
  let sut: GetCategoryController;
  let app: HttpServer;
  let server: Server;

  beforeAll(async () => {
    categoriesRepository = new CategoriesSQLiteRepository(connection);
    getCategoryUseCase = new GetCategoryUseCase(categoriesRepository);
    getCategoryWithPostsUseCase = new GetCategoryWithPostsUseCase(
      categoriesRepository
    );
    sut = new GetCategoryController(
      getCategoryUseCase,
      getCategoryWithPostsUseCase
    );

    app = new HttpServer();

    app.register(url, [
      {
        path: "/:id",
        method: "GET",
        handler: adaptRouteHandler(sut),
      },
    ]);

    server = app.listen(0);
  });

  afterAll(async () => {
    await connection.close();
    server.close();
  });

  it("should get a category and return http status code 200", async () => {
    await categoriesRepository.store(
      Category.create(
        {
          name: "Test Category",
        },
        "categoryId-1"
      )
    );

    const response = await request(server).get(url + "/categoryId-1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: "categoryId-1",
      name: "Test Category",
    });
  });

  it("should return http status code 404 if category does not exists", async () => {
    const response = await request(server).get(url + "/randomId");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Category not found." });
  });
});
