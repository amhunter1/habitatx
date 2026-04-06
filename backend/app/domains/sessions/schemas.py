from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from app.domains.analysis.schemas import RegionAnalysisRead
from app.domains.planning.schemas import CityPlanRead, ScoreCardRead
from app.domains.regions.schemas import RegionRead
from app.domains.reports.schemas import AIReportRead
from app.domains.scenarios.schemas import PlanScenarioRead

RiskProfile = Literal["korunakli", "dengeli", "agresif_buyume"]
SessionStatus = Literal["draft", "analysis_ready", "plan_ready", "report_ready"]


class PlanningSessionCreate(BaseModel):
    selected_region_id: str
    crew_size: int = Field(ge=12, le=60)
    mission_duration_months: int = Field(ge=12, le=96)
    risk_profile: RiskProfile


class QuickstartPatch(BaseModel):
    selected_region_id: str | None = None
    crew_size: int | None = Field(default=None, ge=12, le=60)
    mission_duration_months: int | None = Field(default=None, ge=12, le=96)
    risk_profile: RiskProfile | None = None


class MissionBriefPatch(BaseModel):
    mission_purpose: str | None = None
    target_population: int | None = Field(default=None, ge=1, le=10000)
    energy_strategy: str | None = None
    habitat_type: str | None = None
    water_strategy: str | None = None
    food_strategy: str | None = None
    autonomy_level: int | None = Field(default=None, ge=0, le=100)
    robot_count: int | None = Field(default=None, ge=0, le=10000)
    resupply_dependence: int | None = Field(default=None, ge=0, le=100)
    risk_tolerance: int | None = Field(default=None, ge=0, le=100)
    growth_target: str | None = None


class PlanningSessionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    status: SessionStatus
    selected_region_id: str
    crew_size: int
    mission_duration_months: int
    risk_profile: RiskProfile
    created_at: datetime
    updated_at: datetime


class MissionBriefRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    mission_purpose: str | None = None
    target_population: int | None = None
    energy_strategy: str | None = None
    habitat_type: str | None = None
    water_strategy: str | None = None
    food_strategy: str | None = None
    autonomy_level: int | None = None
    robot_count: int | None = None
    resupply_dependence: int | None = None
    risk_tolerance: int | None = None
    growth_target: str | None = None


class PlanningSessionEnvelope(BaseModel):
    session: PlanningSessionRead
    quickstart: PlanningSessionCreate
    mission_brief: MissionBriefRead | None = None
    region: RegionRead | None = None
    analysis: RegionAnalysisRead | None = None
    plan: CityPlanRead | None = None
    score_card: ScoreCardRead | None = None
    scenarios: list[PlanScenarioRead] = Field(default_factory=list)
    report: AIReportRead | None = None
