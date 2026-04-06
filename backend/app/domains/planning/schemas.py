from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ModuleRecommendationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    module_code: str
    module_name: str
    category: str
    phase_fit: str
    capacity_note: str
    energy_load: str
    reason: str


class CityPhaseRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    phase_order: int
    phase_name: str
    objective: str
    deliverables: list[str]


class CityPlanRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    session_id: str
    scenario_type: str
    headline: str
    top_recommendations: list[str]
    key_constraints: list[str]
    resource_bottlenecks: list[str]
    planner_rationale: str
    created_at: datetime
    phases: list[CityPhaseRead]
    modules: list[ModuleRecommendationRead]


class ScoreCardRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    session_id: str
    site_suitability_score: float
    mission_fit_score: float
    resource_access_score: float
    risk_index: float
    construction_difficulty: float
    resilience_score: float
    autonomy_score: float
    expansion_score: float
    sustainability_score: float
    survival_confidence: float


class GeneratePlanResponse(BaseModel):
    plan: CityPlanRead
    score_card: ScoreCardRead

