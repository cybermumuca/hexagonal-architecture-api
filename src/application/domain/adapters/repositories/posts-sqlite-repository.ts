import { Paginable } from "../../../core/utils/paginable";
import { Post } from "../../entities/post";
import { Connection } from "../../ports/repositories/connection";
import { PostsRepository } from "../../ports/repositories/posts-repository";
import { SQLitePostMapper } from "./mappers/sqlite-post-mapper";

export class PostsSQLiteRepository implements PostsRepository {
  constructor(private readonly connection: Connection) {}

  async store(post: Post): Promise<Post> {
    const { id, content, authorId, categories } = post;

    await this.connection.execute("BEGIN TRANSACTION", []);

    try {
      await this.connection.execute(
        "INSERT INTO posts (id, content, authorId) VALUES (?, ?, ?)",
        [id, content, authorId]
      );

      categories.forEach(async (category) => {
        await this.connection.execute(
          "INSERT INTO posts_categories (post_id, category_id) VALUES (?, ?)",
          [id, category.id]
        );
      });

      await this.connection.execute("COMMIT", []);

      return SQLitePostMapper.toDomain(post);
    } catch (error) {
      await this.connection.execute("ROLLBACK", []);
      throw error;
    }
  }

  async findManyByCategoryId(
    categoryId: string,
    page: number,
    pageSize: number
  ): Promise<Paginable<Post[]>> {
    const offset = (page - 1) * pageSize;

    const { total } = (await this.connection.get(
      `SELECT COUNT(DISTINCT posts.id) as total
      FROM posts
      JOIN posts_categories ON posts.id = posts_categories.post_id
      WHERE posts_categories.category_id = ?`,
      [categoryId]
    )) as { total: number };

    const posts = await this.connection.query<Post[]>(
      `
      SELECT 
        posts.id,
        posts.content,
        posts.authorId,
        JSON_GROUP_ARRAY(JSON_OBJECT('id', categories.id, 'name', categories.name)) AS categories
      FROM posts
      JOIN posts_categories ON posts.id = posts_categories.post_id
      JOIN categories ON posts_categories.category_id = categories.id
      WHERE posts_categories.category_id = ?
      GROUP BY posts.id
      LIMIT ? 
      OFFSET ?
    `,
      [categoryId, pageSize, offset]
    );

    return {
      results: posts.map(SQLitePostMapper.toDomain),
      page,
      pageSize,
      length: posts.length,
      total,
    };
  }

  async findMany(page: number, pageSize: number): Promise<Paginable<Post[]>> {
    const offset = (page - 1) * pageSize;

    const { total } = (await this.connection.get(
      `SELECT COUNT(*) as total FROM posts`,
      []
    )) as { total: number };

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
      GROUP BY posts.id
      LIMIT ? 
      OFFSET ?
    `,
      [pageSize, offset]
    );

    return {
      results: posts.map(SQLitePostMapper.toDomain),
      page,
      pageSize,
      length: posts.length,
      total,
    };
  }

  async findById(id: string): Promise<Post | null> {
    const post = await this.connection.get<Post>(
      `
      SELECT 
        posts.id,
        posts.content,
        posts.authorId,
        JSON_GROUP_ARRAY(JSON_OBJECT('id', categories.id, 'name', categories.name)) AS categories
      FROM posts
      LEFT JOIN posts_categories ON posts.id = posts_categories.post_id
      LEFT JOIN categories ON posts_categories.category_id = categories.id
      WHERE posts.id = ?
      GROUP BY posts.id
    `,
      [id]
    );

    if (!post) return null;

    return SQLitePostMapper.toDomain(post);
  }
}
