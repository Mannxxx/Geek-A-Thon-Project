import vimeo
from .config import StreamConfig
from pathlib import Path

_config = StreamConfig()

_client = vimeo.VimeoClient(
    token=f'{_config.access_token}',
    key=f'{_config.client_identifier}',
    secret=f'{_config.client_secret_key}'
)

temp_dir_path: Path = Path(__file__).parent.joinpath("temp")

_privacy = {"public": "anybody", "private": "nobody", "unlist": "unlisted"}


def upload_video(file_name: str, name: str, desc: dict, visibility: str) -> str:
    return _client.upload(file_name, data={"name": name, "description": desc, "view": _privacy[visibility]}).split("/")[-1]  # return video_id


def get_transcode_status(video_uri: str) -> str:
    response = _client.get(video_uri + '?fields=transcode.status').json()
    return response["transcode"]["status"]


def get_video(video_id: str):
    _client.upload(filename)


def change_privacy(privacy_value: str):
    _client.patch(uri, data={'privacy': {'view': privacy_value}})