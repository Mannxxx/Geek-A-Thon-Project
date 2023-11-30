import logging
import re
from collections import Counter
import joblib
from nltk.stem import PorterStemmer
from transformers import AutoTokenizer
from scipy.special import softmax
from pathlib import Path
from .download_model import get_model
from .fetch_tweets import scrape_tweets
from typing import Dict

_model_url: str = "https://www.transfernow.net/api/transfer/downloads/link?transferId=20230727wV7yRgqI&userSecret=&preview=false&password=&fileId=spETro"

_MODEL = joblib.load((lambda: get_model(_model_url, "sentiment_analysis"))())  # load model


def read_stop_words(file_path: str):
    lines_set = set()

    with open(file_path, 'r') as file:
        for line in file:
            lines_set.add(line.strip())

    return lines_set


def process_tweet(tweet: str) -> str:
    stop_words = read_stop_words(Path(__file__).parent.parent.parent.joinpath("data/artifacts/stopwords.txt"))

    tweet = re.sub(
        r'(?:@|https?://|www|[a-z]?\.com|[!"$%&\'()*+,-./:;<=>?^_`{|}~]|\b\w+\.)\S+|#(?!hashtag\b)[\w-]+(?=(?:\s+#[\w-]+)*\s*$)|[0-9]|#|_',
        "", tweet)
    tweet = re.sub(r'[0-9]', '', tweet)

    words = [word for word in tweet.split() if word not in stop_words]

    words = [PorterStemmer().stem(word) for word in words]

    return ' '.join(word for word in words)


def _predict_sentiment(text: str) -> tuple:
    model = _MODEL

    MODEL = f"cardiffnlp/twitter-roberta-base-sentiment"
    tokenizer = AutoTokenizer.from_pretrained(MODEL)

    encoded_text = tokenizer(text, return_tensors='pt')
    output = model(**encoded_text)
    scores = output[0][0].detach().numpy()
    scores = softmax(scores)

    logging.info(scores)

    if scores[0] > 0.4:
        return 'Negative', scores[0]
    elif scores[2] > 0.4:
        return 'Positive', scores[2]
    return 'Neutral', scores[1]


def tweets_sentiment(tweets: list):
    tweets_comb = []
    sentiments = []

    for tweet in tweets:
        tweet_result = {}
        processed_tweet = process_tweet((tweet['tweet']))
        _sentiment, _score = _predict_sentiment(processed_tweet)

        tweet_result['tweet'] = tweet['tweet']
        tweet_result['score'] = _score
        tweet_result['sentiment'] = _sentiment

        sentiments.append(_sentiment)
        tweets_comb.append(tweet_result)

    total_score = 0
    for value in tweets_comb:
        total_score += value['score']

    return {"score": total_score / len(tweets_comb), "sentiment": Counter(sentiments).most_common(1)[0][0]}


def get_sentiment(event: str, no_of_tweets: int = 100, time_period: str = "1D") -> Dict[str, float | str]:
    try:
        return tweets_sentiment(scrape_tweets(event, no_of_tweets, time_period))
    except Exception as e:
        logging.error(e)
        raise Exception("Sentiment Analysis model is unavailable at the moment :(")


if __name__ == '__main__':
    avg_score, avg_sentiment = get_sentiment('archery')
    print(f'The average score of tweets is {avg_score} and the average sentiment is {avg_sentiment}')
