import joblib
import json
from pathlib import Path
import logging

from .download_model import get_model



__model = None
__data_columns = None
path: Path = Path(__file__).parent.parent.parent
_model_url = "https://www.transfernow.net/api/transfer/downloads/link?transferId=20230727wV7yRgqI&userSecret=&preview=false&password=&fileId=U1CstK"


def get_columns() -> list:
    return __data_columns


def load_saved_artifacts():
    global __model
    global __data_columns

    logging.info('Loading saved artifacts')

    with open(path.joinpath("data/artifacts/columns.json"), 'r') as f:
        __data_columns = json.load(f)['data_columns']

    if __model is None:
        __model = joblib.load(get_model(_model_url, "predict_medal"))

    logging.info('Artifacts loaded')


load_saved_artifacts()  # Load Artifacts


def predict_medal(**kwargs) -> str:
    sex, age, height, weight, country, sport, season = kwargs["sex"], kwargs["age"], kwargs["height"], kwargs["weight"], \
                                                       kwargs["country"], kwargs["sport"], kwargs["season"]

    try:

        with open(path.joinpath('data/artifacts/dict_sex.json'), 'r') as f:
            d = json.load(f)
        sex = int(d[sex])

        with open(path.joinpath('data/artifacts/dict_country.json'), 'r') as f:
            d = json.load(f)
        country = int(d[country])

        with open(path.joinpath('data/artifacts/dict_season.json'), 'r') as f:
            d = json.load(f)
        season = int(d[season])

        with open(path.joinpath('data/artifacts/dict_sport.json'), 'r') as f:
            d = json.load(f)
        sport = int(d[sport])

        medal = __model.predict([[sex, age, height, weight, country, sport, season]])[0]

        with open(path.joinpath('data/artifacts/dict_medal.json'), 'r') as f:
            return json.load(f)[medal]

    except KeyError as err:
        raise Exception(f"Record with Key: {err} doesn't exist")


if __name__ == '__main__':
    load_saved_artifacts()

    print(predict_medal(**{"sex": 'M', 'age': 26, "height": 185.0, "country": 'Mexico', "sport": 'Boxing', "season": 'Winter', "weight": 75}))

    # print(predict_medal('M', 24, 170.0, 63.0, 'France', 'Badminton', 'Summer'))

