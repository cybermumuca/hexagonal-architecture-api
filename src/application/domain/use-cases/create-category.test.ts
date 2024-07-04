import { CategoriesMemoryRepository } from "../../../../test/adapters/repositories/categories-memory-repository";
import { PostsMemoryRepository } from "../../../../test/adapters/repositories/posts-memory-repository";
import { Category } from "../entities/category";
import { CreateCategoryUseCase } from "./create-category";
import { ResourceAlreadyExistsException } from "./errors/resource-already-exists-exception";

describe("Create Category", () => {
  let postsRepository: PostsMemoryRepository;
  let categoriesRepository: CategoriesMemoryRepository;
  let sut: CreateCategoryUseCase;

  beforeEach(() => {
    postsRepository = new PostsMemoryRepository();
    categoriesRepository = new CategoriesMemoryRepository(postsRepository);
    sut = new CreateCategoryUseCase(categoriesRepository);
  });

  it("should create a category", async () => {
    const result = await sut.run({
      name: "Test-1",
    });

    expect(result).toEqual(categoriesRepository.items[0]);
  });

  it("should throw an exception if category already exists", async () => {
    const category = Category.create({ name: "Test-2" });

    categoriesRepository.items.push(category);

    await expect(() => sut.run({ name: category.name })).rejects.toBeInstanceOf(
      ResourceAlreadyExistsException
    );
  });
});
