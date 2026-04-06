from __future__ import annotations

from sqlalchemy import Float, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class Region(Base):
    __tablename__ = "regions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    display_name: Mapped[str] = mapped_column(String(128), nullable=False)
    sector: Mapped[str] = mapped_column(String(64), nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    slope: Mapped[float] = mapped_column(Float, nullable=False)
    roughness: Mapped[float] = mapped_column(Float, nullable=False)
    crater_density: Mapped[float] = mapped_column(Float, nullable=False)
    radiation_estimate: Mapped[float] = mapped_column(Float, nullable=False)
    dust_risk: Mapped[float] = mapped_column(Float, nullable=False)
    ice_probability: Mapped[float] = mapped_column(Float, nullable=False)
    thermal_range: Mapped[float] = mapped_column(Float, nullable=False, default=50)
    solar_efficiency: Mapped[float] = mapped_column(Float, nullable=False)
    landing_safety: Mapped[float] = mapped_column(Float, nullable=False)
    expansion_area: Mapped[float] = mapped_column(Float, nullable=False)
    construction_feasibility: Mapped[float] = mapped_column(Float, nullable=False)
    map_position_x: Mapped[float] = mapped_column(Float, nullable=False)
    map_position_y: Mapped[float] = mapped_column(Float, nullable=False)

