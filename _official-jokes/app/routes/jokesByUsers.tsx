import { User } from "@prisma/client";
import { json, LoaderArgs, ActionFunctionArgs, LinksFunction } from "@remix-run/node";
import {
  Form,
  Link,
  Outlet,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";

import { JokeCard } from "~/components/jokeCard";
import stylesUrl from "~/styles/jokes.css";
import { debounce } from "~/utils/common";
import { db } from "~/utils/db.server";
import { getLatestJokes, userSearch } from "~/utils/request.server";
import { getUser } from "~/utils/session.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];


export const loader = async ({params, request }: LoaderArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const selectedUserId = params.userId
  let selectedUser = null
  let results: User[] = []

  const latestJokes = await getLatestJokes();
  const user = await getUser(request);
  if (q) {
    results = await userSearch(q);
  }
  if(selectedUserId) {
    selectedUser =  await db.user.findUnique({
      select: { id: true, username: true },
      where: { id: selectedUserId },
    });
  }
  return json({ selectedUser, latestJokes, results, q, user });
};


export default function JokesIndexRoute() {
  const { selectedUser, latestJokes, results, q, user } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const handleOnchange = () => {
    const formElement: any = document.getElementById("search-form");
    if (formElement) {
      submit(formElement)
    }
  }
  const debouncedSearch = debounce(handleOnchange,300);

  return (
    <div className="jokes-layout">
      <header className="jokes-header">
        <div className="container">
          <h1 className="home-link">
            <Link to="/" title="Remix Jokes" aria-label="Remix Jokes">
              <span className="logo">🤪</span>
              <span className="logo-medium">J🤪KES</span>
            </Link>
          </h1>
          <div className="search-container">
            <Form id="search-form" role="search" onChange={debouncedSearch}>
              <input
                aria-label="Search User"
                defaultValue={q || ""}
                id="q"
                name="q"
                placeholder="Search jokes by users"
                type="search"
              />
            </Form>
            <div className="search-results">
              {results?.map(user => (
                <Link prefetch="intent" to={user.id} key={user.id}>
                  <div key={user.id} className="user">
                    {user.username}
                  </div>
                </Link>

              ))}
            </div>
          </div>
 
          {user ? (
            <div className="user-info">
              <span>{`Hi ${user.username}`}</span>
              <Form action="/logout" method="post">
                <button type="submit" className="button">
                  Logout
                </button>
              </Form>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>
      <div className="container">
        {!selectedUser && <h3 style={{marginTop: '10px', marginLeft:'12px'}}>Latest Jokes</h3>}
        {!selectedUser && latestJokes.map(joke => (
          <JokeCard joke={joke} jokesterName={joke.jokester.username}/>
        ))}
        {selectedUser && (
          <div className="jokes-container">
            <h2>{selectedUser?.username}'s Jokes</h2>
            <div className="jokes-grid">

            </div>
          </div>
        )}
        <div className="users-outlet">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
