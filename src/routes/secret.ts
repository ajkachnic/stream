import { Elysia, t } from "elysia";
import cookie from "@elysiajs/cookie";
import { marked } from "marked";

import { db } from "../database";
import { template, validateSession } from "../util";

export function secretRoute(app: Elysia) {
  return app
    .use(cookie())
    .get("/secret", async ({ cookie, set }) => {
      if ((await validateSession(cookie.session)) !== null) {
        const notes = await db
          .selectFrom("notes")
          .select(["content", "title", "timestamp", "id"])
          .execute();

        return page({ notes });
      } else {
        set.redirect = "/login";
      }
    })
    .post(
      "/secret",
      async ({ body, cookie, set }) => {
        await db
          .insertInto("notes")
          .values({
            content: body.content,
            title: body.title,
          })
          .execute();

        set.redirect = "/secret";
      },
      {
        body: t.URLEncoded({
          title: t.String(),
          content: t.String(),
        }),
      }
    )
    .delete("/secret/:id", async ({ cookie, params }) => {
      if ((await validateSession(cookie.session)) !== null) {
        const { id } = params;

        await db.deleteFrom("notes").where("id", "=", parseInt(id)).execute();
      }
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
    <title>Stream | Secret</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css">
    <script src="https://unpkg.com/htmx.org@1.9.2"></script>
  </head>
  <body>
    <h1>Secret Page</h1>
    <form action="/logout" method="post">
      <button type="submit">Log Out</button>
    </form>
    <form action="/secret" method="post">
      <label for="title">Title</label>
      <input name="title" placeholder="title goes here..." /> 
      <br />
      <label for="content" placeholder="put some content here">Content</label>
      <textarea name="content"></textarea>
      <button type="submit">Submit</button>
    </form>
    ${notes
      .map(
        (note) => `
      <div>
        <h2>${note.title}</h2>
        <time>${new Date(note.timestamp)}</time>
        <div>${marked.parse(note.content)}</div>
        <button hx-delete="/secret/${note.id}">Delete</button>
      </div>
    `
      )
      .join("")}
  </body>
</html>`
);
