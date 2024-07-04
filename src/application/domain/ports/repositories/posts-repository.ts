import { Paginable } from "../../../core/utils/paginable";
import { Post } from "../../entities/post";

export abstract class PostsRepository {
  abstract findManyByCategoryId(
    categoryId: string,
    page: number,
    pageSize: number
  ): Promise<Paginable<Post[]>>;
  abstract findMany(page: number, pageSize: number): Promise<Paginable<Post[]>>;
  abstract findById(id: string): Promise<Post | null>;
  abstract store(post: Post): Promise<Post>;
}
