import { Entity } from "../../core/entities/entity";
import { Post } from "./post";

interface CategoryWithPostsProps {
  name: string;
  posts: Post[];
}

export class CategoryWithPosts extends Entity<CategoryWithPostsProps> {
  get name() {
    return this.props.name;
  }

  get posts() {
    return this.props.posts;
  }

  static create(props: CategoryWithPostsProps, id?: string) {
    const categoryWithPosts = new CategoryWithPosts(
      {
        ...props,
      },
      id
    );

    return categoryWithPosts;
  }
}
