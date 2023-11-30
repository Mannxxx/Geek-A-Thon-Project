import logging
import os
import jwt
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials
from .config import AuthConfig
from . import token_auth_scheme
from exceptions import JWTException


class VerifyToken:
    """Token verification using PyJWT"""

    # This gets the JWKS from a given URL and does processing, so you can use any of
    # the keys available
    config = AuthConfig()
    jwks_url = f'{config.auth_domain}/.well-known/jwks.json'
    jwks_client = jwt.PyJWKClient(jwks_url)

    def __init__(self):
        self.token = None
        self.permissions = None
        self.scopes = None
        self.signing_key = None

    def verify(self, token: HTTPAuthorizationCredentials = Depends(token_auth_scheme), permissions=None, scopes=None):
        self.token = token.credentials.encode("utf-8")
        self.scopes = scopes
        self.permissions = permissions

        # This gets the 'kid' from the passed token
        try:
            self.signing_key = self.jwks_client.get_signing_key_from_jwt(self.token).key
        except jwt.exceptions.PyJWKClientError as error:
            raise JWTException(error.__str__())
        except jwt.exceptions.DecodeError as error:
            raise JWTException(error.__str__())

        try:
            payload: dict = jwt.decode(
                self.token,
                self.signing_key,
                algorithms=[self.config.algorithm, ],
                audience=f"{self.config.api_url}",
                issuer=f"{self.config.auth_domain}/",
            )
        except Exception as e:
            raise JWTException(str(e))

        if self.scopes:
            result = self._check_claims(payload, 'scope', str, self.scopes.split(' '))
            if result.get("error"):
                return result

        if self.permissions:
            result = self._check_claims(payload, 'permissions', list, self.permissions)
            if result.get("error"):
                return result

        if not payload.get("email", None):
            raise JWTException("Missing Email")

        return payload

    @staticmethod
    def _check_claims(payload, claim_name, claim_type, expected_value):

        instance_check = isinstance(payload[claim_name], claim_type)
        result = {"status": "success", "status_code": 200}

        payload_claim = payload[claim_name]

        if claim_name not in payload or not instance_check:
            result["status"] = "error"
            result["status_code"] = 400

            result["code"] = f"missing_{claim_name}"
            result["msg"] = f"No claim '{claim_name}' found in token."
            return result

        if claim_name == 'scope':
            payload_claim = payload[claim_name].split(' ')

        for value in expected_value:
            if value not in payload_claim:
                result["status"] = "error"
                result["status_code"] = 403

                result["code"] = f"insufficient_{claim_name}"
                result["msg"] = (f"Insufficient {claim_name} ({value}). You don't have "
                                 "access to this resource")
                return result
        return result
