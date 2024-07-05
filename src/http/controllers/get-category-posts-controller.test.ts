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
import { GetCategoryPostsController } from "./get-category-posts-controller";
import { GetCategoryPostsUseCase } from "../../application/domain/use-cases/get-category-posts";
import { PostsSQLiteRepository } from "../../application/domain/adapters/repositories/posts-sqlite-repository";
import { Post } from "../../application/domain/entities/post";
import { createUser } from "../../../test/integration/helpers/create-user";

describe("Get Category Posts Controller (E2E)", () => {
  const url = "/categories";
  const connection = new SQLiteConnection(":memory:");
  let categoriesRepository: CategoriesSQLiteRepository;
  let postsRepository: PostsSQLiteRepository;
  let getCategoryPostsUseCase: GetCategoryPostsUseCase;
  let sut: GetCategoryPostsController;
  let app: HttpServer;
  let server: Server;

  beforeAll(async () => {
    categoriesRepository = new CategoriesSQLiteRepository(connection);
    postsRepository = new PostsSQLiteRepository(connection);
    getCategoryPostsUseCase = new GetCategoryPostsUseCase(
      categoriesRepository,
      postsRepository
    );
    sut = new GetCategoryPostsController(getCategoryPostsUseCase);

    app = new HttpServer();

    app.register(url, [
      {
        path: "/:id/posts",
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

  it("should paginate category posts and return http status code 200", async () => {
    const category1 = Category.create(
      {
        name: "TypeScript",
      },
      "categoryId-1"
    );

    const category2 = Category.create(
      {
        name: "Software Development",
      },
      "categoryId-2"
    );

    const category3 = Category.create(
      {
        name: "Java",
      },
      "categoryId-3"
    );

    const category4 = Category.create(
      {
        name: "Spring Boot",
      },
      "categoryId-4"
    );

    const category5 = Category.create(
      {
        name: "E2E Test",
      },
      "categoryId-5"
    );

    const insertCategoriesQuery = `
    INSERT INTO categories (id, name)
    VALUES 
      ('categoryId-1', 'TypeScript'),
      ('categoryId-2', 'Software Development'),
      ('categoryId-3', 'Java'),
      ('categoryId-4', 'Spring Boot'),
      ('categoryId-5', 'E2E Test')
    `;

    await connection.execute(insertCategoriesQuery, []);

    await createUser(connection, { id: "userId-1" });

    const post1 = Post.create({
      authorId: "userId-1",
      categories: [category1, category2],
      content:
        "Setting up TypeScript projects has become a very extensive job.",
    });

    const post2 = Post.create({
      authorId: "userId-1",
      categories: [category2, category3, category4],
      content:
        "Java projects with Spring Boot are simple to configure, leaving the programmer focused on developing what really matters.",
    });

    const post3 = Post.create({
      authorId: "userId-1",
      categories: [category5],
      content: "e2e tests are slow",
    });

    await postsRepository.store(post1);
    await postsRepository.store(post2);
    await postsRepository.store(post3);

    const response = await request(server).get(url + "/categoryId-2/posts");

    expect(response.status).toBe(200);
    expect(response.body.results).toHaveLength(2)
    expect(response.body.page).toEqual(1);
    expect(response.body.pageSize).toEqual(10);
    expect(response.body.length).toEqual(2);
    expect(response.body.total).toEqual(2);
  });

  it("should return http status code 404 if category does not exists", async () => {
    const response = await request(server).get(url + "/randomId/posts");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Category not found." });
  });
});
