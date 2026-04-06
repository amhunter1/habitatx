from __future__ import annotations

from sqlalchemy.orm import Session

from app.domains.scenarios.models import PlanScenario


class ScenarioRepository:
    def __init__(self, db: Session):
        self.db = db

    def list_by_session_id(self, session_id: str) -> list[PlanScenario]:
        return (
            self.db.query(PlanScenario)
            .filter(PlanScenario.session_id == session_id)
            .order_by(PlanScenario.scenario_name.asc())
            .all()
        )

