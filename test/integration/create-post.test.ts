import { CategoriesSQLiteRepository } from "../../src/application/domain/adapters/repositories/categories-sqlite-repository";
import { PostsSQLiteRepository } from "../../src/application/domain/adapters/repositories/posts-sqlite-repository";
import { SQLiteConnection } from "../../src/application/domain/adapters/repositories/sqlite-connection";
import { Category } from "../../src/application/domain/entities/category";
import { CreatePostUseCase } from "../../src/application/domain/use-cases/create-post";
import { ResourceNotFoundException } from "../../src/application/domain/use-cases/errors/resource-not-found-exception";
import { createUser } from "./helpers/create-user";

describe("Create Post (Integration)", () => {
  let connection: SQLiteConnection;
  let categoriesRepository: CategoriesSQLiteRepository;
  let postsRepository: PostsSQLiteRepository;
  let sut: CreatePostUseCase;

  connection = new SQLiteConnection(":memory:");

  beforeAll(() => {
    postsRepository = new PostsSQLiteRepository(connection);
    categoriesRepository = new CategoriesSQLiteRepository(connection);
    sut = new CreatePostUseCase(categoriesRepository, postsRepository);
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should create a post", async () => {
    const category1 = Category.create(
      {
        name: "Test-1",
      },
      "categoryId-1"
    );

    const category2 = Category.create(
      {
        name: "Test-2",
      },
      "categoryId-2"
    );

    await categoriesRepository.store(category1);
    await categoriesRepository.store(category2);

    await createUser(connection, { id: "authorId-1" });

    const result = await sut.run({
      authorId: "authorId-1",
      categoryIds: ["categoryId-1", "categoryId-2"],
      content: "lorem ipsum dolor sit amet",
    });

    const createdPost = await postsRepository.findById(result.id);

    expect(result).toEqual(createdPost);
    expect(result.id).toBeDefined();
    expect(result.content).toEqual("lorem ipsum dolor sit amet");
    expect(result.authorId).toEqual("authorId-1");
    expect(result.categories).toEqual([category1, category2]);
  });

  it("should throw an exception if some category does not exists", async () => {
    await expect(() =>
      sut.run({
        authorId: "authorId-1",
        content: "lorem ipsum",
        categoryIds: ["3542345"],
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundException);
  });
});
