from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.domains.analysis.schemas import RegionAnalysisRead
from app.domains.planning.schemas import CityPlanRead, ScoreCardRead
from app.domains.regions.repository import RegionRepository
from app.domains.regions.schemas import RegionRead
from app.domains.reports.schemas import AIReportRead
from app.domains.scenarios.schemas import PlanScenarioRead
from app.domains.sessions.models import MissionBrief, PlanningSession
from app.domains.sessions.repository import PlanningSessionRepository
from app.domains.sessions.schemas import (
    MissionBriefPatch,
    MissionBriefRead,
    PlanningSessionCreate,
    PlanningSessionEnvelope,
    PlanningSessionRead,
    QuickstartPatch,
)


class PlanningSessionService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = PlanningSessionRepository(db)
        self.region_repository = RegionRepository(db)

    def create_session(self, payload: PlanningSessionCreate) -> PlanningSessionEnvelope:
        self._validate_region(payload.selected_region_id)
        session = PlanningSession(**payload.model_dump())
        created = self.repository.create(session)
        hydrated = self.repository.get(created.id)
        return self._to_envelope(hydrated)

    def get_session_envelope(self, session_id: str) -> PlanningSessionEnvelope | None:
        session = self.repository.get(session_id)
        if session is None:
            return None
        return self._to_envelope(session)

    def update_quickstart(self, session_id: str, payload: QuickstartPatch) -> PlanningSessionEnvelope | None:
        session = self.repository.get(session_id)
        if session is None:
            return None

        updates = payload.model_dump(exclude_unset=True)
        if "selected_region_id" in updates:
            self._validate_region(updates["selected_region_id"])

        for key, value in updates.items():
            setattr(session, key, value)

        saved = self.repository.save(session)
        return self._to_envelope(saved)

    def update_mission_brief(self, session_id: str, payload: MissionBriefPatch) -> PlanningSessionEnvelope | None:
        session = self.repository.get(session_id)
        if session is None:
            return None

        mission_brief = session.mission_brief or MissionBrief(session_id=session.id)
        updates = payload.model_dump(exclude_unset=True)
        for key, value in updates.items():
            setattr(mission_brief, key, value)

        session.mission_brief = mission_brief
        saved = self.repository.save(session)
        return self._to_envelope(saved)

    def _to_envelope(self, session: PlanningSession | None) -> PlanningSessionEnvelope:
        if session is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Planning session not found")

        return PlanningSessionEnvelope(
            session=PlanningSessionRead.model_validate(session),
            quickstart=PlanningSessionCreate(
                selected_region_id=session.selected_region_id,
                crew_size=session.crew_size,
                mission_duration_months=session.mission_duration_months,
                risk_profile=session.risk_profile,
            ),
            mission_brief=MissionBriefRead.model_validate(session.mission_brief) if session.mission_brief else None,
            region=RegionRead.model_validate(session.region) if session.region else None,
            analysis=RegionAnalysisRead.model_validate(session.analysis) if session.analysis else None,
            plan=CityPlanRead.model_validate(session.city_plan) if session.city_plan else None,
            score_card=ScoreCardRead.model_validate(session.score_card) if session.score_card else None,
            scenarios=[PlanScenarioRead.model_validate(item) for item in session.scenarios],
            report=AIReportRead.model_validate(session.ai_report) if session.ai_report else None,
        )

    def _validate_region(self, region_id: str) -> None:
        if self.region_repository.get(region_id) is None:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Unknown region id")

