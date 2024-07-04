import { Server } from "http";
import request from "supertest";
import { CategoriesSQLiteRepository } from "../../application/domain/adapters/repositories/categories-sqlite-repository";
import { SQLiteConnection } from "../../application/domain/adapters/repositories/sqlite-connection";
import { Category } from "../../application/domain/entities/category";
import { GetCategoriesUseCase } from "../../application/domain/use-cases/get-categories";
import { adaptRouteHandler } from "../../main/adapter/adapt-route-handler";
import HttpServer from "../lib/http-server";
import { GetCategoriesController } from "./get-categories-controller";

describe("Get Categories Controller (E2E)", () => {
  const url = "/categories";
  const connection = new SQLiteConnection(":memory:");
  let categoriesRepository: CategoriesSQLiteRepository;
  let getCategoriesUseCase: GetCategoriesUseCase;
  let sut: GetCategoriesController;
  let app: HttpServer;
  let server: Server;

  beforeAll(async () => {
    categoriesRepository = new CategoriesSQLiteRepository(connection);
    getCategoriesUseCase = new GetCategoriesUseCase(categoriesRepository);
    sut = new GetCategoriesController(getCategoriesUseCase);

    app = new HttpServer();

    app.register(url, [
      {
        path: "/",
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

  it("should paginate categories and return http status code 200", async () => {
    await categoriesRepository.store(
      Category.create(
        {
          name: "Test Category",
        },
        "categoryId-1"
      )
    );

    const response = await request(server).get(url);

    expect(response.status).toBe(200);
    expect(response.body.results).toEqual([
      {
        id: "categoryId-1",
        name: "Test Category",
      },
    ]);
    expect(response.body.length).toEqual(1);
    expect(response.body.page).toEqual(1);
    expect(response.body.pageSize).toEqual(10);
    expect(response.body.total).toEqual(1);
  });

  it("should return http status code 204 if results are empty", async () => {
    const response = await request(server).get(url + "?page=2");
    
    expect(response.status).toBe(204);
  });
});
