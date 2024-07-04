import { User } from "../../../src/application/domain/entities/user";
import { Connection } from "../../../src/application/domain/ports/repositories/connection";

export async function createUser(
  connection: Connection,
  data: Partial<User>
): Promise<void> {
  const override = [
    data.id ?? "authorId-1",
    data.username ?? "Samuel Laurindo",
    data.password ?? "12345678",
  ];

  await connection.execute(
    "INSERT INTO users (id, username, password) VALUES (?, ?, ?)",
    override
  );
}
