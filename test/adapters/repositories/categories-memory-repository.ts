import { Paginable } from "../../../src/application/core/utils/paginable";
import { Category } from "../../../src/application/domain/entities/category";
import { CategoryWithPosts } from "../../../src/application/domain/entities/category-with-posts";
import { Post } from "../../../src/application/domain/entities/post";
import { CategoriesRepository } from "../../../src/application/domain/ports/repositories/categories-repository";
import { PostsMemoryRepository } from "./posts-memory-repository";

export class CategoriesMemoryRepository implements CategoriesRepository {
  public items: Category[] = [];

  constructor(private readonly postsRepository: PostsMemoryRepository) {}

  async store(category: Category): Promise<Category> {
    this.items.push(category);

    return category;
  }

  async findById(id: string): Promise<Category | null> {
    const item = this.items.find((item) => item.id === id);

    if (!item) {
      return null;
    }

    return item;
  }

  async findMany(
    page: number,
    pageSize: number
  ): Promise<Paginable<Category[]>> {
    const items = this.items;

    const total = items.length;
    const startIndex = (page - 1) * pageSize;
    const results = items.slice(startIndex, startIndex + pageSize);
    const length = results.length;

    return {
      results,
      page,
      pageSize,
      length,
      total,
    };
  }

  async findByName(name: string): Promise<Category | null> {
    const item = this.items.find((item) => item.name === name);

    if (!item) {
      return null;
    }

    return item;
  }

  async findWithPostsById(id: string): Promise<CategoryWithPosts | null> {
    const item = this.items.find((item) => item.id === id);

    if (!item) {
      return null;
    }

    const posts = this.postsRepository.items.filter((post: Post) => {
      return post.categories.find((category) => {
        return category.id === item.id;
      });
    });

    return CategoryWithPosts.create(
      {
        name: item.name,
        posts,
      },
      item.id
    );
  }
}
