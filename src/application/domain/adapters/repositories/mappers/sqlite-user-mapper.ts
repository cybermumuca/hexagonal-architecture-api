import { User } from "../../../entities/user";

export class SQLiteUserMapper {
  static toDomain(raw: User): User {
    return User.create(
      {
        username: raw.username,
        password: raw.password,
      },
      raw.id
    );
  }
}
