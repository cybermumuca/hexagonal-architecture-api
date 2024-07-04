import { User } from "../../entities/user";

export abstract class UsersRepository {
  abstract findById(id: string): Promise<User | null>;
  abstract findByUsername(username: string): Promise<User | null>;
  abstract store(user: User): Promise<User>;
}
