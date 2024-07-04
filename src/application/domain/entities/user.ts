import { Entity } from "../../core/entities/entity";

export interface UserProps {
  username: string;
  password: string;
}

export class User extends Entity<UserProps> {
  get username() {
    return this.props.username;
  }

  get password() {
    return this.props.password;
  }

  static create(props: UserProps, id?: string) {
    const user = new User(
      {
        ...props,
      },
      id
    );

    return user;
  }
}
