import type { Joke } from "@prisma/client";
import { getEmoji } from "~/utils/common";

export function JokeCard({
    joke,
    jokesterName
}: {
    joke: Pick<Joke, "content" | "name" | "createdAt" >;
    jokesterName?: string
}) {

    return (
        <div className="Card__root" style={{ margin: '20px' }}>
            <div style={{
                position: 'relative',
                border: '0.5px solid #ffff',
                padding: '10px'
            }}>
                <div style={{
                    position: 'absolute',
                    paddingLeft: '14px',
                    paddingRight   : '14px',
                    background:'#3A0D54',
                    top: '-10px',
                    left: '10px'
                }}>{getEmoji()}</div>
                <div className="content">
                    <p>{joke.content}</p>
                    {jokesterName ? <p>- {jokesterName}</p> : null}
                </div>
            </div>



        </div >
    );
}
