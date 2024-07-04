import { PostsMemoryRepository } from "../../../../test/adapters/repositories/posts-memory-repository";
import { Category } from "../entities/category";
import { Post } from "../entities/post";
import { GetPostsUseCase } from "./get-posts";

describe("Get Posts", () => {
  let postsRepository: PostsMemoryRepository;
  let sut: GetPostsUseCase;

  beforeEach(() => {
    postsRepository = new PostsMemoryRepository();
    sut = new GetPostsUseCase(postsRepository);
  });

  it("should paginate posts", async () => {
    const category1 = Category.create(
      {
        name: "TypeScript",
      },
      "categoryId-1"
    );

    const category2 = Category.create(
      {
        name: "Software Development",
      },
      "categoryId-2"
    );

    const category3 = Category.create(
      {
        name: "Java",
      },
      "categoryId-2"
    );

    const category4 = Category.create(
      {
        name: "Spring Boot",
      },
      "categoryId-2"
    );

    const category5 = Category.create(
      {
        name: "Unit Test",
      },
      "categoryId-2"
    );

    const post1 = Post.create({
      authorId: "userId-1",
      categories: [category1, category2],
      content:
        "Setting up TypeScript projects has become a very extensive job.",
    });

    const post2 = Post.create({
      authorId: "userId-1",
      categories: [category2, category3, category4],
      content:
        "Java projects with Spring Boot are simple to configure, leaving the programmer focused on developing what really matters.",
    });

    const post3 = Post.create({
      authorId: "userId-1",
      categories: [category5],
      content: "When code is uncoupled it is easy to write unit tests.",
    });

    postsRepository.items.push(post1, post2, post3);

    const result = await sut.run({ page: 1, pageSize: 2 });

    expect(result.page).toEqual(1);
    expect(result.pageSize).toEqual(2);
    expect(result.results).toEqual([post1, post2]);
    expect(result.length).toEqual(2);
    expect(result.total).toEqual(postsRepository.items.length);

    const result2 = await sut.run({ page: 3, pageSize: 1 });

    expect(result2.page).toEqual(3);
    expect(result2.pageSize).toEqual(1);
    expect(result2.results).toEqual([post3]);
    expect(result2.length).toEqual(1);
    expect(result2.total).toEqual(postsRepository.items.length);
  });
});
