from __future__ import annotations

from sqlalchemy.orm import Session

from app.domains.analysis.engine import RegionAnalysisEngine
from app.domains.analysis.models import RegionAnalysis
from app.domains.analysis.repository import RegionAnalysisRepository
from app.domains.analysis.schemas import RegionAnalysisRead
from app.domains.regions.repository import RegionRepository
from app.domains.sessions.repository import PlanningSessionRepository


class RegionAnalysisService:
    def __init__(self, db: Session):
        self.db = db
        self.engine = RegionAnalysisEngine()
        self.analysis_repository = RegionAnalysisRepository(db)
        self.region_repository = RegionRepository(db)
        self.session_repository = PlanningSessionRepository(db)

    def generate_for_session(self, session_id: str) -> RegionAnalysisRead | None:
        session = self.session_repository.get(session_id)
        if session is None:
            return None

        region = self.region_repository.get(session.selected_region_id)
        if region is None:
            return None

        generated = self.engine.build_analysis(session_id=session.id, region=region)
        persisted = self.analysis_repository.get_by_session_id(session.id)

        if persisted is None:
            persisted = RegionAnalysis(**generated.model_dump())
        else:
            for key, value in generated.model_dump().items():
                setattr(persisted, key, value)

        self.analysis_repository.save(persisted)
        session.status = "analysis_ready"
        self.session_repository.save(session)
        return RegionAnalysisRead.model_validate(persisted)

