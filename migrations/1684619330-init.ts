import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("notes")
    .addColumn("id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("timestamp", "datetime", (col) =>
      col.defaultTo(sql`current_timestamp`)
    )
    .addColumn("content", "text", (col) => col.notNull())
    .addColumn("title", "text", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("tokens")
    .addColumn("token", "text", (col) => col.primaryKey())
    .execute();

  await db.schema
    .createTable("sessions")
    .addColumn("created", "datetime", (col) =>
      col.defaultTo(sql`current_timestamp`).notNull()
    )
    .addColumn("key", "text", (col) => col.primaryKey())
    .addColumn("token", "text", (col) => col.notNull())
    .addForeignKeyConstraint("token_foreign", ["token"], "tokens", ["token"])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("note").execute();
  await db.schema.dropTable("sessions").execute();
  await db.schema.dropTable("tokens").execute();
}
