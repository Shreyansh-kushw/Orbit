"""Contains the schemas for api requests and responses."""

from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, EmailStr


# User models

class UserBase(BaseModel):
    """Base User class for other User models to build upon"""

    username:str = Field(min_length=1, max_length=50)
    name:str = Field(min_length=1, max_length=200)
    email: EmailStr = Field(max_length=120)


class UserCreate(UserBase):
    """Class for creation of new user"""

    password:str = Field(min_length=8)

class UserUpdate(BaseModel):

    username:str | None = Field(default=None, min_length=1, max_length=50)
    name:str | None = Field(default=None, min_length=1, max_length=200)
    email: EmailStr | None = Field(default=None, max_length=120)
    image_file: str | None =  Field(default=None, max_length=200)


class UserPublic(BaseModel):
    """Class for public for user profile"""

    model_config = ConfigDict(from_attributes=True)

    id: int
    username:str
    name:str
    image_file: str | None
    image_path: str

class UserPrivate(UserBase):
    """Class for the user himself when requesting the profile"""

    email : EmailStr


# Post models

class PostBase(BaseModel):
    """Base Post class for other Post models to build upon"""

    title: str = Field(min_length=1, max_length=100)
    content: str = Field(min_length=1)

class PostCreate(BaseModel):
    """Post class for creation of new posts."""
    
    ...

class PostUpdate(BaseModel):
    """Post class for updating the posts"""

    title: str | None = Field(default=None, min_length=1, max_length=100)
    content: str | None = Field(default=None, min_length=1)

class PostResponse(PostBase):
    """Post class for response on the request for a post"""

    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    date_posted: datetime
    author: UserPublic