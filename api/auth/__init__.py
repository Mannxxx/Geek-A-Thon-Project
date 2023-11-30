from fastapi.security import HTTPBearer, OAuth2PasswordBearer

token_auth_scheme = HTTPBearer(scheme_name="Bearer")

