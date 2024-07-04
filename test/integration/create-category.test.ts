import { CategoriesSQLiteRepository } from "../../src/application/domain/adapters/repositories/categories-sqlite-repository";
import { SQLiteConnection } from "../../src/application/domain/adapters/repositories/sqlite-connection";
import { Category } from "../../src/application/domain/entities/category";
import { CreateCategoryUseCase } from "../../src/application/domain/use-cases/create-category";
import { ResourceAlreadyExistsException } from "../../src/application/domain/use-cases/errors/resource-already-exists-exception";

describe("Create Category (Integration)", () => {
  const connection = new SQLiteConnection(":memory:");
  let categoriesRepository: CategoriesSQLiteRepository;
  let sut: CreateCategoryUseCase;

  beforeAll(() => {
    categoriesRepository = new CategoriesSQLiteRepository(connection);
    sut = new CreateCategoryUseCase(categoriesRepository);
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should create a category", async () => {
    const result = await sut.run({
      name: "Test-1",
    });

    const categoryInDB = await categoriesRepository.findById(result.id);

    expect(result.id).toBeDefined();
    expect(result.name).toEqual("Test-1");
    expect(result).toEqual(categoryInDB);
  });

  it("should throw an exception if category already exists", async () => {
    const category = Category.create({ name: "Test-2" });

    await categoriesRepository.store(category);

    await expect(() => sut.run({ name: "Test-2" })).rejects.toBeInstanceOf(
      ResourceAlreadyExistsException
    );
  });
});
