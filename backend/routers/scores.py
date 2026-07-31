from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import Score, User
from schemas import LeaderboardEntry, ScoreCreate, ScoreResponse

router = APIRouter(prefix="/api/scores", tags=["scores"])


@router.post("/", response_model=ScoreResponse, status_code=201)
def create_score(
    body: ScoreCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    score = Score(
        user_id=current_user.id,
        score=body.score,
        difficulty=body.difficulty,
    )
    db.add(score)
    db.commit()
    db.refresh(score)
    # Convert datetime to ISO string for the response
    return {
        "id": score.id,
        "user_id": score.user_id,
        "score": score.score,
        "difficulty": score.difficulty,
        "played_at": score.played_at.isoformat(),
    }


@router.get("/", response_model=List[ScoreResponse])
def get_my_scores(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    scores = (
        db.query(Score)
        .filter(Score.user_id == current_user.id)
        .order_by(Score.played_at.desc(), Score.id.desc())
        .all()
    )
    return [
        {
            "id": s.id,
            "user_id": s.user_id,
            "score": s.score,
            "difficulty": s.difficulty,
            "played_at": s.played_at.isoformat(),
        }
        for s in scores
    ]


@router.get("/leaderboard", response_model=List[LeaderboardEntry])
def get_leaderboard(db: Session = Depends(get_db)):
    top_scores = (
        db.query(Score, User.username)
        .join(User, Score.user_id == User.id)
        .order_by(Score.score.desc())
        .limit(10)
        .all()
    )
    return [
        {
            "rank": i + 1,
            "username": username,
            "score": score.score,
            "difficulty": score.difficulty,
            "played_at": score.played_at.isoformat(),
        }
        for i, (score, username) in enumerate(top_scores)
    ]
