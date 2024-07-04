import Database, { Database as SQLite3Connection } from "better-sqlite3";
import fs from "fs";
import { Connection } from "../../ports/repositories/connection";

export class SQLiteConnection implements Connection {
  private static db: SQLite3Connection;

  constructor(filepath?: string) {
    if (SQLiteConnection.db) {
      return;
    }

    SQLiteConnection.db = this.createDbConnection(filepath ?? ":memory:");
  }

  async query<T>(query: string, params: any[]): Promise<T> {
    const { db } = SQLiteConnection;

    return new Promise((resolve, reject) => {
      try {
        const statement = db.prepare(query);
        const result = statement.all(...params);
        resolve(result as T);
      } catch (error) {
        reject(error);
      }
    });
  }

  async get<T>(query: string, params: any[]): Promise<T | null> {
    const { db } = SQLiteConnection;

    return new Promise((resolve, reject) => {
      try {
        const statement = db.prepare(query);
        const result = statement.get(...params);
        resolve((result as T) || null);
      } catch (error) {
        reject(error);
      }
    });
  }

  async execute(query: string, params: any[]): Promise<void> {
    const { db } = SQLiteConnection;

    return new Promise((resolve, reject) => {
      try {
        const statement = db.prepare(query);
        statement.run(...params);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  public async close(): Promise<void> {
    const { db } = SQLiteConnection;

    return new Promise((resolve, reject) => {
      try {
        db.close();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  private createDbConnection(filepath: string) {
    if (fs.existsSync(filepath)) {
      return new Database(filepath);
    }

    const db = new Database(filepath);
    this.createTables(db);
    return db;
  }

  private createTables(db: SQLite3Connection) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY NOT NULL,
        username TEXT NOT NULL UNIQUE, 
        password TEXT NOT NULL
      );
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL UNIQUE
      );
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY NOT NULL,
        content TEXT DEFAULT "",
        authorId TEXT NOT NULL,
        FOREIGN KEY (authorId) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE
      );
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS posts_categories (
        category_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        FOREIGN KEY(category_id) REFERENCES categories (id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY(post_id) REFERENCES posts (id) ON UPDATE CASCADE ON DELETE CASCADE
      );
    `);
  }
}
