from __future__ import annotations

from pydantic import BaseModel, ConfigDict


class RegionAnalysisRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    session_id: str
    region_id: str
    site_suitability_score: float
    risk_index: float
    expansion_score: float
    logistics_score: float
    strengths: list[str]
    red_flags: list[str]
    derived_metrics: dict[str, float]
    analysis_summary: str

