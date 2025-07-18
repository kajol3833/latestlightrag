from fastapi import Request, Depends, HTTPException
from .firebase_auth import combined_auth as firebase_combined_auth
from ..utils_api import get_combined_auth_dependency

def get_smart_combined_auth(api_key: str = ""):
    async def dependency(request: Request):
        app_source = request.headers.get("x-app-source", "").lower()
           
        if app_source == "vite":
            return firebase_combined_auth(request)
        else:
            auth_dep = get_combined_auth_dependency(api_key)
            return auth_dep(request)
    return dependency

