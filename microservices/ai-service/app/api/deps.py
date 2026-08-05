import hashlib, hmac, time
from dataclasses import dataclass
from fastapi import Header, HTTPException
from app.core.config import get_settings


@dataclass(frozen=True)
class AuthenticatedIdentity:
    user_id: str
    request_id: str


async def authenticated_identity(
    x_pixellearn_user: str = Header(default=""),
    x_pixellearn_timestamp: str = Header(default=""),
    x_pixellearn_request_id: str = Header(default=""),
    x_pixellearn_signature: str = Header(default=""),
) -> AuthenticatedIdentity:
    settings = get_settings()
    if not all([settings.internal_auth_secret, x_pixellearn_user, x_pixellearn_timestamp, x_pixellearn_request_id, x_pixellearn_signature]):
        raise HTTPException(401, "Authenticated service identity is required")
    try:
        timestamp = int(x_pixellearn_timestamp)
    except ValueError as exc:
        raise HTTPException(401, "Invalid identity timestamp") from exc
    if abs(time.time() - timestamp) > 300:
        raise HTTPException(401, "Expired service identity")
    payload = f"{x_pixellearn_user}.{timestamp}.{x_pixellearn_request_id}".encode()
    expected = hmac.new(settings.internal_auth_secret.encode(), payload, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, x_pixellearn_signature):
        raise HTTPException(401, "Invalid service identity")
    return AuthenticatedIdentity(x_pixellearn_user, x_pixellearn_request_id)
