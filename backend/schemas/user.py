"""
CityPulse - Pydantic Schemas
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any

class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class FilterParams(BaseModel):
    city: Optional[str] = "All"
    date_from: Optional[str] = None
    date_to: Optional[str] = None
    vehicle_type: Optional[str] = "All"
    severity: Optional[str] = "All"
    weather: Optional[str] = "All"
