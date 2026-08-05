import uuid
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.api.routes import router
from app.core.config import get_settings
from app.core.errors import ServiceError, service_error_handler
from app.core.logging import configure_logging


@asynccontextmanager
async def lifespan(_: FastAPI):
    configure_logging()
    yield


app = FastAPI(title="PixelLearn AI Service", version="0.1.0", lifespan=lifespan)
app.add_exception_handler(ServiceError, service_error_handler)
app.include_router(router, prefix=get_settings().api_v1_prefix)


@app.middleware("http")
async def request_id(request: Request, call_next):
    request.state.request_id = request.headers.get("X-PixelLearn-Request-Id", str(uuid.uuid4()))
    try:
        response = await call_next(request)
    except Exception:
        return JSONResponse(status_code=500, content={"error": "The AI service could not process this request.", "request_id": request.state.request_id})
    response.headers["X-Request-Id"] = request.state.request_id
    return response
