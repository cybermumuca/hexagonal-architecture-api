import { User } from "../entities/user";

export class UserPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id,
      username: user.username,
    };
  }
}
