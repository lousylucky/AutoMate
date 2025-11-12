import os
import websockets
from googleapiclient.discovery import build

API_KEY = os.getenv("GOOGLE_API_KEY")

API_SERVICE_NAME = "youtube"
API_VERSION = "v3"


def youtube_search(q, max_results=25):
    youtube = build(API_SERVICE_NAME, API_VERSION, developerKey=API_KEY)

    request = youtube.search().list(
        q=q, part="snippet", type="video", maxResults=max_results
    )

    response = request.execute()

    items = response["items"]
    results = []
    for item in items:
        if item["id"]["kind"] != "youtube#video":
            continue
        results.append(
            {
                "title": item["snippet"]["title"],
                "description": item["snippet"]["description"],
                "videoId": item["id"]["videoId"],
                "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}",
            }
        )
    return results


if __name__ == "__main__":
    query = "Python programming"
    search_results = youtube_search(query)

    for result in search_results:
        print(f"Title: {result['title']}")
        print(f"Description: {result['description']}")
        print(f"URL: {result['url']}")
        print("---")
