import { CategoriesMemoryRepository } from "../../../../test/adapters/repositories/categories-memory-repository";
import { PostsMemoryRepository } from "../../../../test/adapters/repositories/posts-memory-repository";
import { Category } from "../entities/category";
import { ResourceNotFoundException } from "./errors/resource-not-found-exception";
import { GetCategoryUseCase } from "./get-category";

describe("Get Category", () => {
  let postsRepository: PostsMemoryRepository;
  let categoriesRepository: CategoriesMemoryRepository;
  let sut: GetCategoryUseCase;

  beforeEach(() => {
    postsRepository = new PostsMemoryRepository();
    categoriesRepository = new CategoriesMemoryRepository(postsRepository);
    sut = new GetCategoryUseCase(categoriesRepository);
  });

  it("should get a category", async () => {
    const category = Category.create(
      {
        name: "Test-1",
      },
      "1"
    );

    categoriesRepository.items.push(category);

    const result = await sut.run({ categoryId: "1" });

    expect(result).toEqual(categoriesRepository.items[0]);
    expect(result.id).toEqual("1");
    expect(result.name).toEqual("Test-1");
  });

  it("should throw an exception if category does not exists", async () => {
    await expect(sut.run({ categoryId: "randomId" })).rejects.toBeInstanceOf(
      ResourceNotFoundException
    );
  });
});
