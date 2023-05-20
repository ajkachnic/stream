import cookie from "@elysiajs/cookie";
import Elysia, { t } from "elysia";
import { db } from "../database";
import { nanoid } from "nanoid";

export function loginRoute(app: Elysia) {
  return app
    .use(cookie())
    .get("/login", () => {
      return page;
    })
    .post(
      "/login",
      async ({ body, setCookie, set }) => {
        const results = await db
          .selectFrom("tokens")
          .where("token", "=", body.token)
          .select(["token"])
          .execute();

        if (results.length > 0) {
          const sessionKey = nanoid(32);
          await db
            .insertInto("sessions")
            .values({
              key: sessionKey,
              token: results[0].token,
            })
            .execute();

          setCookie("session", sessionKey);
          set.redirect = "/secret";
        } else {
          set.redirect = "/login";
        }
      },
      {
        body: t.URLEncoded({
          token: t.String(),
        }),
      }
    )
    .post("/logout", async ({ cookie, setCookie, set }) => {
      await db
        .deleteFrom("sessions")
        .where("key", "=", cookie.session)
        .execute();
      setCookie("session", "");
      set.redirect = "/secret";
    });
}

const page = `<!DOCTYPE HTML>
<html>
  <head>
    <title>Secret</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css">
  </head>
  <body>
    <h1>Authentication Needed...</h1>
    <form action="/login" method="post">
      <label for="token">Token</label>
      <input name="token" placeholder="token goes here..." /> 
      <br />
      <button type="submit">Submit</button>
    </form>
  </body>
</html>`;
