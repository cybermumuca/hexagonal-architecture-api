import { Entity } from "../../core/entities/entity";
import { Category } from "./category";

export interface PostProps {
  content: string;
  categories: Category[];
  authorId: string;
}

export class Post extends Entity<PostProps> {
  get authorId() {
    return this.props.authorId;
  }

  get content() {
    return this.props.content;
  }

  get categories() {
    return this.props.categories;
  }

  set categories(categories: Category[]) {
    this.props.categories = categories;
  }

  static create(props: PostProps, id?: string) {
    const post = new Post(
      {
        ...props,
      },
      id
    );

    return post;
  }
}
