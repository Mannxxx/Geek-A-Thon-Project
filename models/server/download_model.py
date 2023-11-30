import requests
from pathlib import Path
import logging
from os import makedirs
from os.path import exists


def get_model(model_url: str, file_name: str) -> str | Path:
    dir_path = Path(__file__).parent.parent.parent.joinpath(f"data/models")
    file_location = dir_path.joinpath(f"{file_name}.pickle")
    if file_location.is_file():
        return file_location

    if not exists(dir_path):
        makedirs(dir_path)

    logging.warning(f"Downloading Model: {file_name}")

    resp = _get_request(_get_request(model_url).json()["url"])

    with open(file_location, "wb") as file:
        file.write(resp.content)

    return file_location


def _get_request(url: str):
    resp = requests.get(url)
    if resp.status_code != 200:
        raise Exception(f"Request to download models failed with status code {resp.status_code}")
    return resp
