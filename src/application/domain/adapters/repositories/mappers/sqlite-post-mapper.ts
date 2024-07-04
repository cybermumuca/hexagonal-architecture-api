import { Category } from "../../../entities/category";
import { Post } from "../../../entities/post";

export class SQLitePostMapper {
  static toDomain(raw: Post): Post {
    if (typeof raw.categories === "string") {
      raw.categories = JSON.parse(raw.categories);
    }

    return Post.create(
      {
        authorId: raw.authorId,
        categories: raw.categories.map((category) => {
          return Category.create(
            {
              name: category.name,
            },
            category.id
          );
        }),
        content: raw.content,
      },
      raw.id
    );
  }
}
