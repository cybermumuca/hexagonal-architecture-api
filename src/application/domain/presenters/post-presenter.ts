import { Post } from "../entities/post";
import { CategoryPresenter } from "./category-presenter";

export class PostPresenter {
  static toHTTP(post: Post) {
    return {
      id: post.id,
      content: post.content,
      authorId: post.authorId,
      categories: post.categories.map(CategoryPresenter.toHTTP),
    };
  }
}
