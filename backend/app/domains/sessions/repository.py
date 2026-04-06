from __future__ import annotations

from sqlalchemy.orm import Session, joinedload

from app.domains.planning.models import CityPlan
from app.domains.sessions.models import MissionBrief, PlanningSession


class PlanningSessionRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, session: PlanningSession) -> PlanningSession:
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)
        return session

    def get(self, session_id: str) -> PlanningSession | None:
        return (
            self.db.query(PlanningSession)
            .options(
                joinedload(PlanningSession.mission_brief),
                joinedload(PlanningSession.region),
                joinedload(PlanningSession.analysis),
                joinedload(PlanningSession.city_plan).joinedload(CityPlan.phases),
                joinedload(PlanningSession.city_plan).joinedload(CityPlan.modules),
                joinedload(PlanningSession.score_card),
                joinedload(PlanningSession.scenarios),
                joinedload(PlanningSession.ai_report),
            )
            .filter(PlanningSession.id == session_id)
            .one_or_none()
        )

    def save(self, session: PlanningSession) -> PlanningSession:
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)
        return session

    def get_mission_brief(self, session_id: str) -> MissionBrief | None:
        return self.db.query(MissionBrief).filter(MissionBrief.session_id == session_id).one_or_none()

