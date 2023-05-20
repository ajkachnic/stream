import memoized from "nano-memoize";
import { db } from "./database";

export function template<T>(f: (x: T) => string): (x: T) => Response {
  let memo = memoized((x: T) => f(x));

  return (x: T) => {
    let result = memo(x);

    return new Response(result, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  };
}

export async function validateSession(session: string) {
  const result = await db
    .selectFrom("sessions")
    .select(["token", "key"])
    .where("key", "=", session)
    .executeTakeFirst();

  if (result) return result;

  return null;
}
