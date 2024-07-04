import { SQLiteConnection } from "../../../application/domain/adapters/repositories/sqlite-connection";
import { UsersSQLiteRepository } from "../../../application/domain/adapters/repositories/users-sqlite-repository";
import { GetUserUseCase } from "../../../application/domain/use-cases/get-user";

export function makeGetUser(): GetUserUseCase {
  const usersRepository = new UsersSQLiteRepository(new SQLiteConnection());
  return new GetUserUseCase(usersRepository);
}
