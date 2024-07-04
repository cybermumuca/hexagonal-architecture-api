import { User } from "../../entities/user";
import { Connection } from "../../ports/repositories/connection";
import { UsersRepository } from "../../ports/repositories/users-repository";
import { SQLiteUserMapper } from "./mappers/sqlite-user-mapper";

export class UsersSQLiteRepository implements UsersRepository {
  constructor(private readonly connection: Connection) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.connection.get<User>(
      "SELECT * FROM users where id = ?",
      [id]
    );

    if (!user) return null;

    return SQLiteUserMapper.toDomain(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.connection.get<User>(
      "SELECT * FROM users where username = ?",
      [username]
    );

    if (!user) return null;

    return SQLiteUserMapper.toDomain(user);
  }

  async store(user: User): Promise<User> {
    await this.connection.execute(
      "INSERT INTO users (id, username, password) VALUES (?, ?, ?)",
      [user.id, user.username, user.password]
    );

    return user;
  }
}
