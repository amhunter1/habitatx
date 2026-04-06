from __future__ import annotations

from sqlalchemy.orm import Session

from app.domains.analysis.service import RegionAnalysisService
from app.domains.planning.engine import PlanningEngine
from app.domains.planning.phase_builder import build_city_phases
from app.domains.planning.repository import PlanningRepository
from app.domains.planning.schemas import CityPlanRead, ScoreCardRead
from app.domains.scoring.engine import ScoreCardEngine
from app.domains.sessions.repository import PlanningSessionRepository


class PlanningService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = PlanningRepository(db)
        self.session_repository = PlanningSessionRepository(db)
        self.analysis_service = RegionAnalysisService(db)
        self.engine = PlanningEngine()
        self.score_engine = ScoreCardEngine()

    def generate_plan(self, session_id: str) -> tuple[CityPlanRead, ScoreCardRead] | None:
        session = self.session_repository.get(session_id)
        if session is None:
            return None

        analysis = session.analysis
        if analysis is None:
            self.analysis_service.generate_for_session(session_id)
            session = self.session_repository.get(session_id)
            if session is None or session.analysis is None:
                return None
            analysis = session.analysis

        plan, module_templates, reserve_policy_score = self.engine.build_plan(session, analysis)
        persisted_plan = self.repository.get_plan_by_session_id(session.id)

        if persisted_plan is None:
            persisted_plan = plan
            self.db.add(persisted_plan)
            self.db.flush()
        else:
            persisted_plan.scenario_type = plan.scenario_type
            persisted_plan.headline = plan.headline
            persisted_plan.top_recommendations = plan.top_recommendations
            persisted_plan.key_constraints = plan.key_constraints
            persisted_plan.resource_bottlenecks = plan.resource_bottlenecks
            persisted_plan.planner_rationale = plan.planner_rationale
            persisted_plan.phases.clear()
            persisted_plan.modules.clear()
            self.db.flush()

        persisted_plan.modules.extend(self.engine.attach_plan_id(module_templates, persisted_plan.id))
        persisted_plan.phases.extend(build_city_phases(persisted_plan.id, persisted_plan.modules))
        self.db.commit()
        self.db.refresh(persisted_plan)

        score_card = self.score_engine.build_score_card(
            session=session,
            analysis=analysis,
            module_codes=[module.module_code for module in persisted_plan.modules],
            reserve_policy_score=reserve_policy_score,
        )
        existing_score_card = self.repository.get_score_card(session.id)
        if existing_score_card is None:
            existing_score_card = score_card
        else:
            for key, value in score_card.__dict__.items():
                if key.startswith("_"):
                    continue
                setattr(existing_score_card, key, value)
        saved_score_card = self.repository.save_score_card(existing_score_card)

        session.status = "plan_ready"
        self.session_repository.save(session)
        persisted_plan = self.repository.get_plan_by_session_id(session.id) or persisted_plan
        return CityPlanRead.model_validate(persisted_plan), ScoreCardRead.model_validate(saved_score_card)

