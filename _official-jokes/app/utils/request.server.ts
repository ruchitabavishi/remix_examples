import { Joke, User } from "@prisma/client";
import { json } from "@remix-run/node";
import { db } from "./db.server";

/**
 * This helper function helps us to return the accurate HTTP status,
 * 400 Bad Request, to the client.
 */
export const badRequest = <T>(data: T) => json<T>(data, { status: 400 });

export async function userSearch(text: string | undefined) {
  const allUsers: User[] = await db.user.findMany({
    where: {
      username: {
        contains: text || ""
      }
    }
  });
  return allUsers;
}

export async function getLatestJokes() {
  const latestJokes: Joke[] = await db.joke.findMany({
    include: { jokester : true },
    take: 5 ,
    orderBy: { createdAt: "desc" },
  })
  return latestJokes
}

