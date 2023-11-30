import random
import string
from fastapi.responses import RedirectResponse, Response, HTMLResponse, JSONResponse
from fastapi import status, Cookie, APIRouter, Depends, Request
from .config import AuthConfig
import requests
import base64
from .utils import basic_auth, rand_string
from . import token_auth_scheme
from exceptions import JWTException
import logging


settings = AuthConfig()
auth_route = APIRouter(tags=["auth"])


@auth_route.get("/", response_class=HTMLResponse)
async def home(request: Request):
    with open("api/test.html", "r") as f:
        resp = HTMLResponse(f.read())
    resp.set_cookie("oauth_state", rand_string())
    return resp


@auth_route.post("/login", response_class=RedirectResponse)
async def login(oauth_state: str = Cookie(None)):
    if not oauth_state:
        return RedirectResponse("/", status_code=status.HTTP_401_UNAUTHORIZED)

    return JSONResponse({"authorize_url": f"{settings.auth_domain}/authorize?response_type=code&client_id={settings.auth_client_id}&audience={settings.api_url}&redirect_uri={settings.app_url}/callback&scope=openid+profile+email+offline_access&state={oauth_state}"})


@auth_route.post("/token")
def get_token(code: str, state: str, oauth_state: str = Cookie(None)):
    if oauth_state != state:
        return Response("Invalid State", status_code=status.HTTP_400_BAD_REQUEST)

    headers = {"Authorization": basic_auth(settings.auth_client_id, settings.auth_client_secret)}
    data = {
        "grant_type": "authorization_code",
        "redirect_uri": f"{settings.app_url}/callback",
        "code": code}

    resp = requests.post(url=f"{settings.auth_domain}/oauth/token", json=data, headers=headers)
    return JSONResponse(resp.json(), status_code=resp.status_code)


@auth_route.post("/logout")
async def logout(token: str = Depends(token_auth_scheme)):
    resp = requests.post(url=f"{settings.auth_domain}/oidc/logout?id_token_hint={token}")
    if resp.status_code != 200:
        logging.warning(resp.content)
        raise JWTException(resp.content)
    return {"status": "success"}


@auth_route.post("/refresh")
async def refresh(refresh_token: str):
    payload = f"grant_type=refresh_token&client_id={settings.auth_client_id}&client_secret={settings.auth_client_secret}&refresh_token={refresh_token}"

    resp = requests.post(url=f"{settings.auth_domain}/oauth/token", data=payload)

    return JSONResponse(resp.json(), status_code=resp.status_code)
