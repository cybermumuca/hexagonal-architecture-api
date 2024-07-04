import { CategoriesSQLiteRepository } from "../../src/application/domain/adapters/repositories/categories-sqlite-repository";
import { SQLiteConnection } from "../../src/application/domain/adapters/repositories/sqlite-connection";
import { Category } from "../../src/application/domain/entities/category";
import { GetCategoriesUseCase } from "../../src/application/domain/use-cases/get-categories";

describe("Get Categories (Integration)", () => {
  const connection = new SQLiteConnection(":memory:");
  let categoriesRepository: CategoriesSQLiteRepository;
  let sut: GetCategoriesUseCase;

  beforeAll(() => {
    categoriesRepository = new CategoriesSQLiteRepository(connection);
    sut = new GetCategoriesUseCase(categoriesRepository);
  });

  afterAll(async () => {
    await connection.close();
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

    await categoriesRepository.store(category1);
    await categoriesRepository.store(category2);

    const result = await sut.run({ page: 1, pageSize: 2 });

    const { total } = (await connection.get(
      `SELECT COUNT(*) as total FROM categories`,
      []
    )) as { total: number };

    expect(result.page).toEqual(1);
    expect(result.pageSize).toEqual(2);
    expect(result.results).toEqual([
      expect.any(Category),
      expect.any(Category),
    ]);
    expect(result.length).toEqual(2);
    expect(result.total).toEqual(total);
  });
});
