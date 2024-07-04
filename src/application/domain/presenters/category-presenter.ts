import { Category } from "../entities/category";

export class CategoryPresenter {
  static toHTTP(category: Category) {
    return {
      id: category.id,
      name: category.name,
    };
  }
}
