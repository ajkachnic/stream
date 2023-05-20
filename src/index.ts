import { Elysia, t } from "elysia";
import { cookie } from "@elysiajs/cookie";
import { html } from "@elysiajs/html";
import { marked } from "marked";
import { nanoid } from "nanoid";

import { db } from "./database";
import { loginRoute } from "./routes/login";
import { indexRoute } from "./routes";
import { secretRoute } from "./routes/secret";

marked.use({
  pedantic: false,
  mangle: false,
  headerIds: false,
});

function createToken() {
  const token = nanoid(32);
  db.insertInto("tokens").values({ token }).execute();

  console.log(`Created token: ${token}`);
}

const app = new Elysia()
  .use(html())
  .use(cookie())
  .use(loginRoute)
  .use(indexRoute)
  .use(secretRoute)
  .listen(3000);

console.log(
  `Elysia is running at ${app.server?.hostname}:${app.server?.port}\n`
);
