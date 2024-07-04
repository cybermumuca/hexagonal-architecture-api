import { CategoriesSQLiteRepository } from "../../src/application/domain/adapters/repositories/categories-sqlite-repository";
import { SQLiteConnection } from "../../src/application/domain/adapters/repositories/sqlite-connection";
import { Category } from "../../src/application/domain/entities/category";
import { ResourceNotFoundException } from "../../src/application/domain/use-cases/errors/resource-not-found-exception";
import { GetCategoryUseCase } from "../../src/application/domain/use-cases/get-category";

describe("Get Category (Integration)", () => {
  const connection = new SQLiteConnection(":memory:");
  let categoriesRepository: CategoriesSQLiteRepository;
  let sut: GetCategoryUseCase;

  beforeAll(() => {
    categoriesRepository = new CategoriesSQLiteRepository(connection);
    sut = new GetCategoryUseCase(categoriesRepository);
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should get a category", async () => {
    const category = Category.create(
      {
        name: "Test-1",
      },
      "1"
    );

    await categoriesRepository.store(category);

    const result = await sut.run({ categoryId: "1" });

    expect(result).toEqual(category);
    expect(result.id).toEqual("1");
    expect(result.name).toEqual("Test-1");
  });

  it("should throw an exception if category does not exists", async () => {
    await expect(sut.run({ categoryId: "randomId" })).rejects.toBeInstanceOf(
      ResourceNotFoundException
    );
  });
});
