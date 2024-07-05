import { Server } from "http";
import request from "supertest";
import { createUser } from "../../../test/integration/helpers/create-user";
import { PostsSQLiteRepository } from "../../application/domain/adapters/repositories/posts-sqlite-repository";
import { SQLiteConnection } from "../../application/domain/adapters/repositories/sqlite-connection";
import { Category } from "../../application/domain/entities/category";
import { Post } from "../../application/domain/entities/post";
import { adaptRouteHandler } from "../../main/adapter/adapt-route-handler";
import HttpServer from "../lib/http-server";
import { GetPostsController } from "./get-posts-controller";
import { GetPostsUseCase } from "../../application/domain/use-cases/get-posts";

describe("Get Posts Controller (E2E)", () => {
  const url = "/posts";
  const connection = new SQLiteConnection(":memory:");
  let postsRepository: PostsSQLiteRepository;
  let getPostsUseCase: GetPostsUseCase;
  let sut: GetPostsController;
  let app: HttpServer;
  let server: Server;

  beforeAll(async () => {
    postsRepository = new PostsSQLiteRepository(connection);
    getPostsUseCase = new GetPostsUseCase(postsRepository);
    sut = new GetPostsController(getPostsUseCase);

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

  it("should paginate posts and return http status code 200", async () => {
    const category = Category.create(
      {
        name: "Testing",
      },
      "categoryId-1"
    );

    await connection.execute(
      "INSERT INTO categories (id, name) VALUES (?, ?)",
      [category.id, category.name]
    );

    await createUser(connection, { id: "userId-1" });

    const post = Post.create(
      {
        authorId: "userId-1",
        categories: [category],
        content: "bla bla bla",
      },
      "postId-1"
    );

    const post2 = Post.create(
      {
        authorId: "userId-1",
        categories: [category],
        content: "what if i code a search engine?",
      },
      "postId-2"
    );

    const post3 = Post.create(
      {
        authorId: "userId-1",
        categories: [category],
        content: "tomorrow my vacation ends",
      },
      "postId-3"
    );

    const post4 = Post.create(
      {
        authorId: "userId-1",
        categories: [category],
        content: "good morning everybody",
      },
      "postId-4"
    );

    await postsRepository.store(post);
    await postsRepository.store(post2);
    await postsRepository.store(post3);
    await postsRepository.store(post4);

    const response = await request(server).get(url);

    expect(response.status).toBe(200);
    expect(response.body.results).toEqual([
      {
        id: "postId-1",
        content: "bla bla bla",
        authorId: "userId-1",
        categories: [
          {
            id: "categoryId-1",
            name: "Testing",
          },
        ],
      },
      {
        id: "postId-2",
        content: "what if i code a search engine?",
        authorId: "userId-1",
        categories: [
          {
            id: "categoryId-1",
            name: "Testing",
          },
        ],
      },
      {
        id: "postId-3",
        content: "tomorrow my vacation ends",
        authorId: "userId-1",
        categories: [
          {
            id: "categoryId-1",
            name: "Testing",
          },
        ],
      },
      {
        id: "postId-4",
        content: "good morning everybody",
        authorId: "userId-1",
        categories: [
          {
            id: "categoryId-1",
            name: "Testing",
          },
        ],
      },
    ]);
    expect(response.body.length).toEqual(4);
    expect(response.body.page).toEqual(1);
    expect(response.body.pageSize).toEqual(10);
    expect(response.body.total).toEqual(4);
  });

  it("should return http status code 204 if results are empty", async () => {
    const response = await request(server).get(url + "?page=2");

    expect(response.status).toBe(204);
  });
});
