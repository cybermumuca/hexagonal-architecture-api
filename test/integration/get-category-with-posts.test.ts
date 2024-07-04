import { CategoriesSQLiteRepository } from "../../src/application/domain/adapters/repositories/categories-sqlite-repository";
import { PostsSQLiteRepository } from "../../src/application/domain/adapters/repositories/posts-sqlite-repository";
import { SQLiteConnection } from "../../src/application/domain/adapters/repositories/sqlite-connection";
import { Category } from "../../src/application/domain/entities/category";
import { Post } from "../../src/application/domain/entities/post";
import { ResourceNotFoundException } from "../../src/application/domain/use-cases/errors/resource-not-found-exception";
import { GetCategoryWithPostsUseCase } from "../../src/application/domain/use-cases/get-category-with-posts";
import { createUser } from "./helpers/create-user";

describe("Get Category With Posts (Integration)", () => {
  const connection = new SQLiteConnection(":memory:");
  let postsRepository: PostsSQLiteRepository;
  let categoriesRepository: CategoriesSQLiteRepository;
  let sut: GetCategoryWithPostsUseCase;

  beforeAll(() => {
    postsRepository = new PostsSQLiteRepository(connection);
    categoriesRepository = new CategoriesSQLiteRepository(connection);
    sut = new GetCategoryWithPostsUseCase(categoriesRepository);
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should get a category with posts", async () => {
    const category1 = Category.create(
      {
        name: "TypeScript",
      },
      "categoryId-1"
    );

    const category2 = Category.create(
      {
        name: "Java",
      },
      "categoryId-2"
    );

    await categoriesRepository.store(category1);
    await categoriesRepository.store(category2);

    const post1 = Post.create(
      {
        authorId: "userId-1",
        categories: [category1],
        content: "TypeScript is awesome",
      },
      "postId-1"
    );

    const post2 = Post.create(
      {
        authorId: "userId-2",
        categories: [category1, category2],
        content: "TypeScript or Java?",
      },
      "postId-2"
    );

    await createUser(connection, { id: "userId-1" });
    await createUser(connection, {
      id: "userId-2",
      username: "Samuel Laurindo 2",
    });

    await postsRepository.store(post1);
    await postsRepository.store(post2);

    const categoryWithPosts = await sut.run({ categoryId: category1.id });

    expect(categoryWithPosts.id).toEqual(category1.id);
    expect(categoryWithPosts.name).toEqual("TypeScript");
    expect(categoryWithPosts.posts.length).toEqual(2);

    expect(categoryWithPosts.posts[0].id).toEqual("postId-1");
    expect(categoryWithPosts.posts[0].authorId).toEqual("userId-1");
    expect(categoryWithPosts.posts[0].categories).toEqual([category1]);
    expect(categoryWithPosts.posts[0].content).toEqual("TypeScript is awesome");

    expect(categoryWithPosts.posts[1].id).toEqual("postId-2");
    expect(categoryWithPosts.posts[1].authorId).toEqual("userId-2");
    expect(categoryWithPosts.posts[1].categories).toEqual([
      category1,
      category2,
    ]);
    expect(categoryWithPosts.posts[1].content).toEqual("TypeScript or Java?");
  });

  it("should throw an exception if category does not exists", async () => {
    await expect(sut.run({ categoryId: "randomId" })).rejects.toBeInstanceOf(
      ResourceNotFoundException
    );
  });
});
