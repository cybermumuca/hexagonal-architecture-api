import { Server } from "http";
import request from "supertest";
import { createUser } from "../../../test/integration/helpers/create-user";
import { PostsSQLiteRepository } from "../../application/domain/adapters/repositories/posts-sqlite-repository";
import { SQLiteConnection } from "../../application/domain/adapters/repositories/sqlite-connection";
import { Category } from "../../application/domain/entities/category";
import { Post } from "../../application/domain/entities/post";
import { GetPostUseCase } from "../../application/domain/use-cases/get-post";
import { adaptRouteHandler } from "../../main/adapter/adapt-route-handler";
import HttpServer from "../lib/http-server";
import { GetPostController } from "./get-post-controller";

describe("Get Post Controller (E2E)", () => {
  const url = "/posts";
  const connection = new SQLiteConnection(":memory:");
  let postsRepository: PostsSQLiteRepository;
  let getPostUseCase: GetPostUseCase;
  let sut: GetPostController;
  let app: HttpServer;
  let server: Server;

  beforeAll(async () => {
    postsRepository = new PostsSQLiteRepository(connection);
    getPostUseCase = new GetPostUseCase(postsRepository);
    sut = new GetPostController(getPostUseCase);

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

  it("should get a post and return http status code 200", async () => {
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

    await postsRepository.store(post);

    const response = await request(server).get(url + "/postId-1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: "postId-1",
      content: "bla bla bla",
      authorId: "userId-1",
      categories: [
        {
          id: "categoryId-1",
          name: "Testing",
        },
      ],
    });
  });

  it("should return http status code 404 if post does not exists", async () => {
    const response = await request(server).get(url + "/randomId");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Post not found." });
  });
});
