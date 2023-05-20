import { Generated, Kysely } from "kysely";
import { BunSqliteDialect } from "../sqlite";

import { Database } from "bun:sqlite";

interface Note {
  id: Generated<number>;
  timestamp: Generated<string>;
  content: string;
  title: string;
}

interface Auth {
  token: string;
}

interface Session {
  created: Generated<string>;
  key: string;
  token: string;
}

interface DatabaseType {
  notes: Note;
  tokens: Auth;
  sessions: Session;
}

export const db = new Kysely<DatabaseType>({
  dialect: new BunSqliteDialect({
    database: new Database("./stream.sqlite"),
  }),
});
