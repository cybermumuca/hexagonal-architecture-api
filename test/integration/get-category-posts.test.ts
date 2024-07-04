import { CategoriesSQLiteRepository } from "../../src/application/domain/adapters/repositories/categories-sqlite-repository";
import { PostsSQLiteRepository } from "../../src/application/domain/adapters/repositories/posts-sqlite-repository";
import { SQLiteConnection } from "../../src/application/domain/adapters/repositories/sqlite-connection";
import { Category } from "../../src/application/domain/entities/category";
import { Post } from "../../src/application/domain/entities/post";
import { ResourceNotFoundException } from "../../src/application/domain/use-cases/errors/resource-not-found-exception";
import { GetCategoryPostsUseCase } from "../../src/application/domain/use-cases/get-category-posts";
import { createUser } from "./helpers/create-user";

describe("Get Category Posts", () => {
  const connection = new SQLiteConnection(":memory:");
  let postsRepository: PostsSQLiteRepository;
  let categoriesRepository: CategoriesSQLiteRepository;
  let sut: GetCategoryPostsUseCase;

  beforeEach(() => {
    postsRepository = new PostsSQLiteRepository(connection);
    categoriesRepository = new CategoriesSQLiteRepository(connection);
    sut = new GetCategoryPostsUseCase(categoriesRepository, postsRepository);
  });

  it("should paginate category posts", async () => {
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
        name: "Unit Test",
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
      ('categoryId-5', 'Unit Test')
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
      content: "When code is uncoupled it is easy to write unit tests.",
    });

    await postsRepository.store(post1);
    await postsRepository.store(post2);
    await postsRepository.store(post3);

    const result = await sut.run({
      page: 1,
      pageSize: 3,
      categoryId: "categoryId-2",
    });

    expect(result.page).toEqual(1);
    expect(result.pageSize).toEqual(3);
    expect(result.results).toEqual([expect.any(Post), expect.any(Post)]);
    expect(result.length).toEqual(2);
    expect(result.total).toEqual(2);
  });

  it("should throw an exception if category does not exists", async () => {
    await expect(
      sut.run({ categoryId: "randomId", page: 1, pageSize: 3 })
    ).rejects.toBeInstanceOf(ResourceNotFoundException);
  });
});
