import { Paginable } from "../../../core/utils/paginable";
import { Category } from "../../entities/category";
import { CategoryWithPosts } from "../../entities/category-with-posts";

export abstract class CategoriesRepository {
  abstract store(category: Category): Promise<Category>;
  abstract findMany(
    page: number,
    pageSize: number
  ): Promise<Paginable<Category[]>>;
  abstract findByName(name: string): Promise<Category | null>;
  abstract findById(id: string): Promise<Category | null>;
  abstract findWithPostsById(id: string): Promise<CategoryWithPosts | null>;
}
