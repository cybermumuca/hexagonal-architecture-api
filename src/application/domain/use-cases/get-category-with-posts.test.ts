import { CategoriesMemoryRepository } from "../../../../test/adapters/repositories/categories-memory-repository";
import { PostsMemoryRepository } from "../../../../test/adapters/repositories/posts-memory-repository";
import { Category } from "../entities/category";
import { Post } from "../entities/post";
import { ResourceNotFoundException } from "./errors/resource-not-found-exception";
import { GetCategoryWithPostsUseCase } from "./get-category-with-posts";

describe("Get Category With Posts", () => {
  let postsRepository: PostsMemoryRepository;
  let categoriesRepository: CategoriesMemoryRepository;
  let sut: GetCategoryWithPostsUseCase;

  beforeEach(() => {
    postsRepository = new PostsMemoryRepository();
    categoriesRepository = new CategoriesMemoryRepository(postsRepository);
    sut = new GetCategoryWithPostsUseCase(categoriesRepository);
  });

  it("should get a category with posts", async () => {
    const category1 = Category.create(
      {
        name: "TypeScript",
      },
      "categoryId-1"
    );

    const category2 = Category.create(
      {
        name: "Java",
      },
      "categoryId-2"
    );

    categoriesRepository.items.push(category1, category2);

    const post1 = Post.create(
      {
        authorId: "userId-1",
        categories: [category1],
        content: "TypeScript is awesome",
      },
      "postId-1"
    );

    const post2 = Post.create(
      {
        authorId: "userId-2",
        categories: [category1, category2],
        content: "TypeScript or Java?",
      },
      "postId-2"
    );

    postsRepository.items.push(post1, post2);

    const categoryWithPosts = await sut.run({ categoryId: category1.id });

    expect(categoryWithPosts.id).toEqual(category1.id);
    expect(categoryWithPosts.name).toEqual("TypeScript");
    expect(categoryWithPosts.posts.length).toEqual(2);

    expect(categoryWithPosts.posts[0].id).toEqual("postId-1");
    expect(categoryWithPosts.posts[0].authorId).toEqual("userId-1");
    expect(categoryWithPosts.posts[0].categories).toEqual([category1]);
    expect(categoryWithPosts.posts[0].content).toEqual("TypeScript is awesome");

    expect(categoryWithPosts.posts[1].id).toEqual("postId-2");
    expect(categoryWithPosts.posts[1].authorId).toEqual("userId-2");
    expect(categoryWithPosts.posts[1].categories).toEqual([
      category1,
      category2,
    ]);
    expect(categoryWithPosts.posts[1].content).toEqual("TypeScript or Java?");
  });

  it("should throw an exception if category does not exists", async () => {
    await expect(sut.run({ categoryId: "randomId" })).rejects.toBeInstanceOf(
      ResourceNotFoundException
    );
  });
});
