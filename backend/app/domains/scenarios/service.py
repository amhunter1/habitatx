from __future__ import annotations

from sqlalchemy.orm import Session

from app.domains.analysis.schemas import RegionAnalysisRead
from app.domains.planning.service import PlanningService
from app.domains.planning.schemas import ScoreCardRead
from app.domains.scenarios.engine import ScenarioEngine
from app.domains.scenarios.models import PlanScenario
from app.domains.scenarios.repository import ScenarioRepository
from app.domains.scenarios.schemas import PlanScenarioRead
from app.domains.sessions.repository import PlanningSessionRepository
from app.domains.sessions.schemas import PlanningSessionRead


class ScenarioService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = ScenarioRepository(db)
        self.session_repository = PlanningSessionRepository(db)
        self.planning_service = PlanningService(db)
        self.engine = ScenarioEngine()

    def generate_scenarios(self, session_id: str) -> list[PlanScenarioRead] | None:
        session_model = self.session_repository.get(session_id)
        if session_model is None:
            return None

        if session_model.analysis is None or session_model.score_card is None:
            self.planning_service.generate_plan(session_id)
            session_model = self.session_repository.get(session_id)
            if session_model is None or session_model.analysis is None or session_model.score_card is None:
                return None

        session = PlanningSessionRead.model_validate(session_model)
        analysis = RegionAnalysisRead.model_validate(session_model.analysis)
        score_card = ScoreCardRead.model_validate(session_model.score_card)

        existing = self.repository.list_by_session_id(session_id)
        for scenario in existing:
            self.db.delete(scenario)
        self.db.flush()

        generated = self.engine.build_scenarios(session, analysis, score_card)
        self.db.add_all(generated)
        self.db.commit()
        return [PlanScenarioRead.model_validate(item) for item in self.repository.list_by_session_id(session_id)]

