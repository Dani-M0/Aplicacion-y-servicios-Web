from pydantic import BaseModel, ConfigDict


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserCreate(BaseModel):
    username: str
    password: str
    role: str = "reader"


class UserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    role: str


class ItemCreate(BaseModel):
    name: str
    description: str = ""


class ItemPublic(ItemCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
