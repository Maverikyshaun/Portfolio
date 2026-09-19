from pydantic import EmailStr, Field, HttpUrl

from app.enums import AvailabilityStatus
from app.schemas.common import ApiModel


class ProfileOut(ApiModel):
    id: int
    full_name: str = Field(min_length=2, max_length=120)
    first_name: str = Field(min_length=1, max_length=80)
    headline: str = Field(min_length=4, max_length=180)
    location: str = Field(min_length=2, max_length=160)
    email: EmailStr
    phone: str = Field(min_length=8, max_length=40)
    summary: str = Field(min_length=40, max_length=2000)
    years_experience: int = Field(ge=0, le=50)
    availability: AvailabilityStatus
    photo_url: str = Field(min_length=4, max_length=500)
    cv_url: str = Field(min_length=4, max_length=500)
    linkedin_url: HttpUrl | None = None
    github_url: HttpUrl | None = None
    website_url: HttpUrl | None = None
