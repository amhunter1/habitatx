from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db import get_db
from app.domains.analysis.schemas import RegionAnalysisRead
from app.domains.analysis.service import RegionAnalysisService
from app.domains.planning.schemas import GeneratePlanResponse
from app.domains.planning.service import PlanningService
from app.domains.reports.schemas import AIReportRead
from app.domains.reports.service import ReportService
from app.domains.scenarios.schemas import PlanScenarioRead
from app.domains.scenarios.service import ScenarioService
from app.domains.sessions.schemas import (
    MissionBriefPatch,
    PlanningSessionCreate,
    PlanningSessionEnvelope,
    QuickstartPatch,
)
from app.domains.sessions.service import PlanningSessionService

router = APIRouter(prefix="/planning-sessions", tags=["planning-sessions"])


@router.post("", response_model=PlanningSessionEnvelope, status_code=status.HTTP_201_CREATED)
def create_planning_session(
    payload: PlanningSessionCreate,
    db: Session = Depends(get_db),
) -> PlanningSessionEnvelope:
    service = PlanningSessionService(db)
    return service.create_session(payload)


@router.get("/{session_id}", response_model=PlanningSessionEnvelope)
def get_planning_session(session_id: str, db: Session = Depends(get_db)) -> PlanningSessionEnvelope:
    service = PlanningSessionService(db)
    envelope = service.get_session_envelope(session_id)
    if envelope is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Planning session not found")
    return envelope


@router.patch("/{session_id}/quickstart", response_model=PlanningSessionEnvelope)
def patch_quickstart(
    session_id: str,
    payload: QuickstartPatch,
    db: Session = Depends(get_db),
) -> PlanningSessionEnvelope:
    service = PlanningSessionService(db)
    envelope = service.update_quickstart(session_id, payload)
    if envelope is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Planning session not found")
    return envelope


@router.patch("/{session_id}/mission-brief", response_model=PlanningSessionEnvelope)
def patch_mission_brief(
    session_id: str,
    payload: MissionBriefPatch,
    db: Session = Depends(get_db),
) -> PlanningSessionEnvelope:
    service = PlanningSessionService(db)
    envelope = service.update_mission_brief(session_id, payload)
    if envelope is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Planning session not found")
    return envelope


@router.post("/{session_id}/analyze-region", response_model=RegionAnalysisRead)
def analyze_region(session_id: str, db: Session = Depends(get_db)) -> RegionAnalysisRead:
    service = RegionAnalysisService(db)
    analysis = service.generate_for_session(session_id)
    if analysis is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Planning session not found")
    return analysis


@router.post("/{session_id}/generate-plan", response_model=GeneratePlanResponse)
def generate_plan(session_id: str, db: Session = Depends(get_db)) -> GeneratePlanResponse:
    service = PlanningService(db)
    result = service.generate_plan(session_id)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Planning session not found")
    plan, score_card = result
    return GeneratePlanResponse(plan=plan, score_card=score_card)


@router.post("/{session_id}/generate-scenarios", response_model=list[PlanScenarioRead])
def generate_scenarios(session_id: str, db: Session = Depends(get_db)) -> list[PlanScenarioRead]:
    service = ScenarioService(db)
    result = service.generate_scenarios(session_id)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Planning session not found")
    return result


@router.post("/{session_id}/generate-report", response_model=AIReportRead)
def generate_report(session_id: str, db: Session = Depends(get_db)) -> AIReportRead:
    service = ReportService(db)
    result = service.generate_report(session_id)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Planning session not found")
    return result

