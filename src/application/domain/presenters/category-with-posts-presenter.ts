import { CategoryWithPosts } from "../entities/category-with-posts";
import { PostPresenter } from "./post-presenter";

export class CategoryWithPostsPresenter {
  static toHTTP(categoryWithPosts: CategoryWithPosts) {
    return {
      id: categoryWithPosts.id,
      name: categoryWithPosts.name,
      posts: categoryWithPosts.posts.map(PostPresenter.toHTTP),
    };
  }
}
