import firebase_admin
from firebase_admin import credentials, auth
from fastapi import Request, HTTPException, status, Depends

cred = credentials.Certificate("firebase-service-account.json")
firebase_admin.initialize_app(cred)

async def combined_auth(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing or invalid token")

    token = auth_header.split(" ")[1]
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token  # this will include user ID, email, etc.
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid Firebase token: {str(e)}")
