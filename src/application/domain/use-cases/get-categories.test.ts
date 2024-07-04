import { CategoriesMemoryRepository } from "../../../../test/adapters/repositories/categories-memory-repository";
import { PostsMemoryRepository } from "../../../../test/adapters/repositories/posts-memory-repository";
import { Category } from "../entities/category";
import { GetCategoriesUseCase } from "./get-categories";

describe("Get Categories", () => {
  let postsRepository: PostsMemoryRepository;
  let categoriesRepository: CategoriesMemoryRepository;
  let sut: GetCategoriesUseCase;

  beforeEach(() => {
    postsRepository = new PostsMemoryRepository();
    categoriesRepository = new CategoriesMemoryRepository(postsRepository);
    sut = new GetCategoriesUseCase(categoriesRepository);
  });

  it("should paginate categories", async () => {
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

    const result = await sut.run({ page: 1, pageSize: 2 });

    expect(result.page).toEqual(1);
    expect(result.pageSize).toEqual(2);
    expect(result.results).toEqual([category1, category2]);
    expect(result.length).toEqual(2);
    expect(result.total).toEqual(categoriesRepository.items.length);
  });
});
