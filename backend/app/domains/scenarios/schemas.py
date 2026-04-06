from __future__ import annotations

from pydantic import BaseModel, ConfigDict


class PlanScenarioRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    session_id: str
    scenario_name: str
    optimization_target: str
    mission_fit_score: float
    risk_index: float
    autonomy_score: float
    cost_discipline_score: float
    summary: str

