from pydantic import BaseModel, Field


class UserRegister(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    password: str = Field(min_length=6, max_length=128)


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# --- Scores ---

class ScoreCreate(BaseModel):
    score: int = Field(ge=0)
    difficulty: str = Field(pattern="^(low|medium|high)$")


class ScoreResponse(BaseModel):
    id: int
    user_id: int
    score: int
    difficulty: str
    played_at: str

    model_config = {"from_attributes": True}


class LeaderboardEntry(BaseModel):
    rank: int
    username: str
    score: int
    difficulty: str
    played_at: str
