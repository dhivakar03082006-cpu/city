"""
CityPulse - Authentication Router
"""

from fastapi import APIRouter, HTTPException, Depends
from backend.schemas.user import UserLogin, UserRegister, TokenResponse
import time

router = APIRouter()

# Demo credentials
DEMO_EMAIL = "demo@citypulse.com"
DEMO_PASS = "demo123"

@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin):
    if payload.email == DEMO_EMAIL and payload.password == DEMO_PASS:
        return {
            "access_token": "cp_jwt_token_demo_sample_token_authorized_access",
            "token_type": "bearer",
            "user": {
                "id": "usr-001",
                "email": DEMO_EMAIL,
                "full_name": "Senior Traffic Analyst",
                "role": "Lead Intelligence Analyst",
                "organization": "CityPulse Urban Labs"
            }
        }
    elif payload.email and len(payload.password) >= 6:
        # Allow logged in demo access
        return {
            "access_token": f"cp_jwt_{int(time.time())}_token",
            "token_type": "bearer",
            "user": {
                "id": "usr-user",
                "email": payload.email,
                "full_name": payload.email.split("@")[0].capitalize(),
                "role": "Data Analyst",
                "organization": "Department of Urban Safety"
            }
        }
    raise HTTPException(status_code=401, detail="Invalid email or password. Use demo@citypulse.com / demo123")

@router.post("/register", response_model=TokenResponse)
def register(payload: UserRegister):
    return {
        "access_token": f"cp_jwt_new_{int(time.time())}",
        "token_type": "bearer",
        "user": {
            "id": "usr-new",
            "email": payload.email,
            "full_name": payload.full_name,
            "role": "Registered Analyst",
            "organization": "CityPulse Intelligence"
        }
    }
