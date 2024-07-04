import { User } from "../../../src/application/domain/entities/user";
import { UsersRepository } from "../../../src/application/domain/ports/repositories/users-repository";

export class UsersMemoryRepository implements UsersRepository {
  public items: User[] = [];

  async findById(id: string): Promise<User | null> {
    const item = this.items.find((item) => item.id === id);

    if (!item) {
      return null;
    }

    return item;
  }

  async findByUsername(username: string): Promise<User | null> {
    const item = this.items.find((item) => item.username === username);

    if (!item) {
      return null;
    }

    return item;
  }

  async store(user: User): Promise<User> {
    this.items.push(user);

    return user;
  }
}
