import logging

import requests
from .config import TweetScraperConfig

_tweet_scraper_config = TweetScraperConfig()


def scrape_tweets(event: str, no_of_tweets: int, time_period: str) -> list:

    payload = {'api_key': _tweet_scraper_config.api_key, 'query': [event], 'num': no_of_tweets, 'time_period': time_period}
    response = requests.get(_tweet_scraper_config.scraper_url, params=payload)

    if response.status_code != 200:
        logging.error(f"scraping request failed with status: {response.status_code}")
        raise Exception(f"scraping request failed with status: {response.status_code}")

    data = response.json()

    all_tweets = data['organic_results']

    list_tweet = []

    for i in range(len(all_tweets)):
        dict_tweet = {}
        try:
            dict_tweet['tweet'] = all_tweets[i]['snippet'].split('—')[1].strip()
            dict_tweet['link'] = all_tweets[i]['link']
            list_tweet.append(dict_tweet)
        except KeyError:
            continue
        except IndexError:
            dict_tweet['tweet'] = all_tweets[i]['snippet']
            dict_tweet['link'] = all_tweets[i]['link']
            list_tweet.append(dict_tweet)

    return list_tweet

# print(len(scrape_tweets()))
# print(scrape_tweets()[:5])


