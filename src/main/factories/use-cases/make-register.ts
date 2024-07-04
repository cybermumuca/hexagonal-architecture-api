import { BcryptHasher } from "../../../application/domain/adapters/cryptography/bcrypt-hasher";
import { SQLiteConnection } from "../../../application/domain/adapters/repositories/sqlite-connection";
import { UsersSQLiteRepository } from "../../../application/domain/adapters/repositories/users-sqlite-repository";
import { RegisterUseCase } from "../../../application/domain/use-cases/register";

export function makeRegister(): RegisterUseCase {
  const usersRepository = new UsersSQLiteRepository(new SQLiteConnection());
  const cryptoHash = new BcryptHasher();
  return new RegisterUseCase(usersRepository, cryptoHash);
}
