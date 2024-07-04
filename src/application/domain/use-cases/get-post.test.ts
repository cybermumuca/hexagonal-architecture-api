import { PostsMemoryRepository } from "../../../../test/adapters/repositories/posts-memory-repository";
import { Category } from "../entities/category";
import { Post } from "../entities/post";
import { ResourceNotFoundException } from "./errors/resource-not-found-exception";
import { GetPostUseCase } from "./get-post";

describe("Get Post", () => {
  let postsRepository: PostsMemoryRepository;
  let sut: GetPostUseCase;

  beforeEach(() => {
    postsRepository = new PostsMemoryRepository();
    sut = new GetPostUseCase(postsRepository);
  });

  it("should get a post", async () => {
    const category = Category.create(
      {
        name: "Test-1",
      },
      "categoryId-1"
    );

    const post = Post.create(
      {
        authorId: "userId-1",
        categories: [category],
        content: "bla bla bla",
      },
      "postId-1"
    );

    postsRepository.items.push(post);

    const result = await sut.run({ postId: "postId-1" });

    expect(result).toEqual(post);
    expect(result.id).toEqual("postId-1");
    expect(result.categories).toEqual([category]);
    expect(result.content).toEqual("bla bla bla");
    expect(result.authorId).toEqual("userId-1");
  });

  it("should throw an exception if post does not exists", async () => {
    await expect(sut.run({ postId: "randomId" })).rejects.toBeInstanceOf(
      ResourceNotFoundException
    );
  });
});
