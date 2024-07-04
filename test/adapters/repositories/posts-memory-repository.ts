import { Paginable } from "../../../src/application/core/utils/paginable";
import { Post } from "../../../src/application/domain/entities/post";
import { PostsRepository } from "../../../src/application/domain/ports/repositories/posts-repository";

export class PostsMemoryRepository implements PostsRepository {
  public items: Post[] = [];

  async store(post: Post): Promise<Post> {
    this.items.push(post);

    return post;
  }

  async findById(id: string): Promise<Post | null> {
    const item = this.items.find((item) => item.id === id);

    if (!item) {
      return null;
    }

    return item;
  }

  async findManyByCategoryId(
    categoryId: string,
    page: number,
    pageSize: number
  ): Promise<Paginable<Post[]>> {
    const items = this.items.filter((post) => {
      return post.categories.some((category) => category.id === categoryId);
    });

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

  async findMany(page: number, pageSize: number): Promise<Paginable<Post[]>> {
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
}
