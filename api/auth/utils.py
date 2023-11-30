import base64
import random
import requests
import string


def basic_auth(user_id: str, password: str) -> str:
    credentials = f"{user_id}:{password}"
    encoded_credentials = base64.b64encode(credentials.encode('utf-8')).decode('utf-8')
    return f"Basic {encoded_credentials}"


def rand_string(length: int = 30) -> str:  # generate a random string of length 30 by default
    return "".join(random.choice(string.ascii_letters) for _ in range(length))


def get_user_info(access_token: str) -> dict:
    headers = {"Authorization": f"Bearer {access_token}"}
    resp = requests.post(url=f"{settings.auth_domain}/userinfo", headers=headers)

    if resp.status_code != 200:
        raise Exception("Failed request")
    return resp.json()
