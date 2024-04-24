import { Joke } from "@prisma/client";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
    useLoaderData,
} from "@remix-run/react";

import { JokeCard } from "~/components/jokeCard";
import { db } from "~/utils/db.server";

export const loader = async ({ params }: LoaderArgs) => {
    const jokes = await db.joke.findMany({
        where:
        {
            jokesterId: params.userId
        }
    });
    return json({
        jokes
    });
};

export default function UserRoute() {
    const data = useLoaderData<typeof loader>();

    return (
        data?.jokes.map(joke => (
            <JokeCard joke={joke} />
        ))
    )

}

