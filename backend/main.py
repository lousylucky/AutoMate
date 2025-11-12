import asyncio
from websockets.asyncio.server import serve
from websockets.exceptions import ConnectionClosedOK
from music import youtube_search
import json


async def ainput(prompt: str) -> str:
    return await asyncio.to_thread(input, f"{prompt} ")


async def handler(websocket):
    while True:
        try:
            query = await ainput("Cherche le son et je met le 1er")
            results = await asyncio.to_thread(youtube_search, query)
            the_chosen_one = results[0]
            await websocket.send(json.dumps(the_chosen_one))

        except ConnectionClosedOK:
            print("C tchao")
            break


async def main():
    async with serve(handler, "localhost", 4703) as server:
        await server.serve_forever()


if __name__ == "__main__":
    asyncio.run(main())
