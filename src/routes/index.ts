import { Elysia } from "elysia";

import { db } from "../database";
import { template } from "../util";
import { marked } from "marked";

export function indexRoute(app: Elysia) {
  return app.get("/", async () => {
    const notes = await db
      .selectFrom("notes")
      .select(["content", "title", "timestamp", "id"])
      .execute();

    return page({ notes });
  });
}

const page = template<{
  notes: {
    content: string;
    title: string;
    timestamp: string;
    id: number;
  }[];
}>(
  ({ notes }) => `<!DOCTYPE HTML>
<html>
  <head>
    <title>Stream</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css">
  </head>
  <body>
    <h1>The Stream</h1>
    ${notes
      .map(
        (note) => `
      <div>
        <h2>${note.title}</h2>
        <time>${new Date(note.timestamp)}</time>
        <div>${marked.parse(note.content)}</div>
      </div>
    `
      )
      .join("")}
  </body>
</html>
`
);
