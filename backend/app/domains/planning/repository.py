from __future__ import annotations

from sqlalchemy.orm import Session, joinedload

from app.domains.planning.models import CityPlan, ScoreCard


class PlanningRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_plan_by_session_id(self, session_id: str) -> CityPlan | None:
        return (
            self.db.query(CityPlan)
            .options(joinedload(CityPlan.phases), joinedload(CityPlan.modules))
            .filter(CityPlan.session_id == session_id)
            .one_or_none()
        )

    def save_plan(self, plan: CityPlan) -> CityPlan:
        self.db.add(plan)
        self.db.commit()
        self.db.refresh(plan)
        return self.get_plan_by_session_id(plan.session_id) or plan

    def get_score_card(self, session_id: str) -> ScoreCard | None:
        return self.db.query(ScoreCard).filter(ScoreCard.session_id == session_id).one_or_none()

    def save_score_card(self, score_card: ScoreCard) -> ScoreCard:
        self.db.add(score_card)
        self.db.commit()
        self.db.refresh(score_card)
        return score_card

