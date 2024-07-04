import { Paginable } from "../../../core/utils/paginable";
import { Category } from "../../entities/category";
import { CategoryWithPosts } from "../../entities/category-with-posts";
import { Post } from "../../entities/post";
import { CategoriesRepository } from "../../ports/repositories/categories-repository";
import { Connection } from "../../ports/repositories/connection";
import { SQLiteCategoryMapper } from "./mappers/sqlite-category-mapper";
import { SQLitePostMapper } from "./mappers/sqlite-post-mapper";

export class CategoriesSQLiteRepository implements CategoriesRepository {
  constructor(private readonly connection: Connection) {}

  async store(category: Category): Promise<Category> {
    await this.connection.execute(
      "INSERT INTO categories (id, name) VALUES (?, ?)",
      [category.id, category.name]
    );

    return category;
  }

  async findByName(name: string): Promise<Category | null> {
    const category = await this.connection.get<Category>(
      "SELECT * FROM categories WHERE name = ?",
      [name]
    );

    if (!category) return null;

    return SQLiteCategoryMapper.toDomain(category);
  }

  async findById(id: string): Promise<Category | null> {
    const category = await this.connection.get<Category>(
      "SELECT * FROM categories WHERE id = ?",
      [id]
    );

    if (!category) return null;

    return SQLiteCategoryMapper.toDomain(category);
  }

  async findMany(
    page: number,
    pageSize: number
  ): Promise<Paginable<Category[]>> {
    const offset = (page - 1) * pageSize;

    const { total } = (await this.connection.get(
      `SELECT COUNT(*) as total FROM categories`,
      []
    )) as { total: number };

    const categories = await this.connection.query<Category[]>(
      `SELECT * FROM categories LIMIT ? OFFSET ?`,
      [pageSize, offset]
    );

    return {
      results: categories.map(SQLiteCategoryMapper.toDomain),
      page,
      pageSize,
      length: categories.length,
      total,
    };
  }

  async findWithPostsById(id: string): Promise<CategoryWithPosts | null> {
    const category = await this.connection.get<Category>(
      "SELECT * FROM categories WHERE id = ?",
      [id]
    );

    if (!category) {
      return null;
    }

    const posts = await this.connection.query<Post[]>(
      `
      SELECT 
        posts.id,
        posts.content,
        posts.authorId,
        JSON_GROUP_ARRAY(JSON_OBJECT('id', categories.id, 'name', categories.name)) AS categories
      FROM posts
      LEFT JOIN posts_categories ON posts.id = posts_categories.post_id
      LEFT JOIN categories ON posts_categories.category_id = categories.id
      WHERE posts.id IN (
        SELECT post_id FROM posts_categories WHERE category_id = ?
      )
      GROUP BY posts.id
      LIMIT 20
    `,
      [category.id]
    );

    return CategoryWithPosts.create(
      { name: category.name, posts: posts.map(SQLitePostMapper.toDomain) },
      category.id
    );
  }
}
