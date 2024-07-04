import { PostsSQLiteRepository } from "../../src/application/domain/adapters/repositories/posts-sqlite-repository";
import { SQLiteConnection } from "../../src/application/domain/adapters/repositories/sqlite-connection";
import { Category } from "../../src/application/domain/entities/category";
import { Post } from "../../src/application/domain/entities/post";
import { ResourceNotFoundException } from "../../src/application/domain/use-cases/errors/resource-not-found-exception";
import { GetPostUseCase } from "../../src/application/domain/use-cases/get-post";
import { createUser } from "./helpers/create-user";

describe("Get Post (Integration)", () => {
  const connection = new SQLiteConnection(":memory:");
  let postsRepository: PostsSQLiteRepository;
  let sut: GetPostUseCase;

  beforeAll(() => {
    postsRepository = new PostsSQLiteRepository(connection);
    sut = new GetPostUseCase(postsRepository);
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should get a post", async () => {
    const category = Category.create(
      {
        name: "Test-1",
      },
      "categoryId-1"
    );

    const post = Post.create(
      {
        authorId: "userId-1",
        categories: [category],
        content: "bla bla bla",
      },
      "postId-1"
    );

    await createUser(connection, { id: "userId-1" });

    await connection.execute(
      "INSERT INTO categories (id, name) VALUES (?, ?)",
      [category.id, category.name]
    );

    await postsRepository.store(post);

    const result = await sut.run({ postId: "postId-1" });

    expect(result).toEqual(post);
    expect(result.id).toEqual("postId-1");
    expect(result.categories).toEqual([category]);
    expect(result.content).toEqual("bla bla bla");
    expect(result.authorId).toEqual("userId-1");
  });

  it("should throw an exception if post does not exists", async () => {
    await expect(sut.run({ postId: "randomId" })).rejects.toBeInstanceOf(
      ResourceNotFoundException
    );
  });
});
