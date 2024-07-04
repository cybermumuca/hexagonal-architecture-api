import { PostsSQLiteRepository } from "../../src/application/domain/adapters/repositories/posts-sqlite-repository";
import { SQLiteConnection } from "../../src/application/domain/adapters/repositories/sqlite-connection";
import { Category } from "../../src/application/domain/entities/category";
import { Post } from "../../src/application/domain/entities/post";
import { GetPostsUseCase } from "../../src/application/domain/use-cases/get-posts";
import { createUser } from "./helpers/create-user";

describe("Get Posts (Integration)", () => {
  const connection = new SQLiteConnection(":memory:");
  let postsRepository: PostsSQLiteRepository;
  let sut: GetPostsUseCase;

  beforeAll(() => {
    postsRepository = new PostsSQLiteRepository(connection);
    sut = new GetPostsUseCase(postsRepository);
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should paginate posts", async () => {
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
      "categoryId-2"
    );

    const category4 = Category.create(
      {
        name: "Spring Boot",
      },
      "categoryId-2"
    );

    const category5 = Category.create(
      {
        name: "Unit Test",
      },
      "categoryId-2"
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

    await createUser(connection, { id: "userId-1" });

    await postsRepository.store(post1);
    await postsRepository.store(post2);
    await postsRepository.store(post3);

    const result = await sut.run({ page: 1, pageSize: 2 });

    const { total } = (await connection.get(
      `SELECT COUNT(*) as total FROM posts`,
      []
    )) as { total: number };

    expect(result.page).toEqual(1);
    expect(result.pageSize).toEqual(2);
    expect(result.results).toEqual([expect.any(Post), expect.any(Post)]);
    expect(result.length).toEqual(2);
    expect(result.total).toEqual(total);
  });
});
