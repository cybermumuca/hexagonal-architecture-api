import { Category } from "../../../entities/category";

export class SQLiteCategoryMapper {
  static toDomain(raw: Category) {
    return Category.create(
      {
        name: raw.name,
      },
      raw.id
    );
  }
}
