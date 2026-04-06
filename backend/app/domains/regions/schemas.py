from __future__ import annotations

from pydantic import BaseModel, ConfigDict


class RegionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    display_name: str
    sector: str
    summary: str
    slope: float
    roughness: float
    crater_density: float
    radiation_estimate: float
    dust_risk: float
    ice_probability: float
    thermal_range: float
    solar_efficiency: float
    landing_safety: float
    expansion_area: float
    construction_feasibility: float
    map_position_x: float
    map_position_y: float

