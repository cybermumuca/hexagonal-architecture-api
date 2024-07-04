import { User } from "../entities/user";
import { UsersRepository } from "../ports/repositories/users-repository";
import { ResourceNotFoundException } from "./errors/resource-not-found-exception";

type Input = {
  userId: string;
};

export class GetUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async run({ userId }: Input): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundException();
    }

    return user;
  }
}
