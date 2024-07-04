import { CategoriesMemoryRepository } from "../../../../test/adapters/repositories/categories-memory-repository";
import { PostsMemoryRepository } from "../../../../test/adapters/repositories/posts-memory-repository";
import { Category } from "../entities/category";
import { Post } from "../entities/post";
import { ResourceNotFoundException } from "./errors/resource-not-found-exception";
import { GetCategoryPostsUseCase } from "./get-category-posts";

describe("Get Category Posts", () => {
  let postsRepository: PostsMemoryRepository;
  let categoriesRepository: CategoriesMemoryRepository;
  let sut: GetCategoryPostsUseCase;

  beforeEach(() => {
    postsRepository = new PostsMemoryRepository();
    categoriesRepository = new CategoriesMemoryRepository(postsRepository);
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

    categoriesRepository.items.push(
      category1,
      category2,
      category3,
      category4,
      category5
    );

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

    postsRepository.items.push(post1, post2, post3);

    const result = await sut.run({
      page: 1,
      pageSize: 3,
      categoryId: "categoryId-2",
    });

    expect(result.page).toEqual(1);
    expect(result.pageSize).toEqual(3);
    expect(result.results).toEqual([post1, post2]);
    expect(result.length).toEqual(2);
    expect(result.total).toEqual(2);
  });

  it("should throw an exception if category does not exists", async () => {
    await expect(
      sut.run({ categoryId: "randomId", page: 1, pageSize: 3 })
    ).rejects.toBeInstanceOf(ResourceNotFoundException);
  });
});
