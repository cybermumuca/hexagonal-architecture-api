import { BcryptHasher } from "../../../application/domain/adapters/cryptography/bcrypt-hasher";
import { JwtHandler } from "../../../application/domain/adapters/cryptography/jwt-handler";
import { SQLiteConnection } from "../../../application/domain/adapters/repositories/sqlite-connection";
import { UsersSQLiteRepository } from "../../../application/domain/adapters/repositories/users-sqlite-repository";
import { SignInUseCase } from "../../../application/domain/use-cases/sign-in";

export function makeSignIn(): SignInUseCase {
  const usersRepository = new UsersSQLiteRepository(new SQLiteConnection());
  const cryptoHash = new BcryptHasher();
  const tokenHandler = new JwtHandler();
  return new SignInUseCase(usersRepository, cryptoHash, tokenHandler);
}
