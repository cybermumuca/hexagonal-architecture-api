import { CategoriesMemoryRepository } from "../../../../test/adapters/repositories/categories-memory-repository";
import { PostsMemoryRepository } from "../../../../test/adapters/repositories/posts-memory-repository";
import { Category } from "../entities/category";
import { CreatePostUseCase } from "./create-post";
import { ResourceNotFoundException } from "./errors/resource-not-found-exception";

describe("Create Post", () => {
  let categoriesRepository: CategoriesMemoryRepository;
  let postsRepository: PostsMemoryRepository;
  let sut: CreatePostUseCase;

  beforeEach(() => {
    postsRepository = new PostsMemoryRepository();
    categoriesRepository = new CategoriesMemoryRepository(postsRepository);
    sut = new CreatePostUseCase(categoriesRepository, postsRepository);
  });

  it("should create a post", async () => {
    const category1 = Category.create(
      {
        name: "Test-1",
      },
      "1"
    );

    const category2 = Category.create(
      {
        name: "Test-2",
      },
      "2"
    );

    categoriesRepository.items.push(category1, category2);

    const result = await sut.run({
      authorId: "authorId-1",
      categoryIds: ["1", "2"],
      content: "lorem ipsum dolor sit amet",
    });

    expect(result).toEqual(postsRepository.items[0]);
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
