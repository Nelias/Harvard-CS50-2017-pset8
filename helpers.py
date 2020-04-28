import feedparser
from urllib.parse import urlparse

def lookup(geo):
    """Looks up articles for geo."""

    # check cache for geo
    if geo in lookup.cache:
        return lookup.cache[geo]

    # get feed from Google
    feed = feedparser.parse("https://news.google.com/rss/search?q=\"{geo}\"&cf=all&hl=pl&pz=1&gl=PL")

    # cache results
    lookup.cache[geo] = [{"link": item["link"], "title": item["title"]} for item in feed["items"]]

    # return results
    return lookup.cache[geo]


lookup.cache = {}