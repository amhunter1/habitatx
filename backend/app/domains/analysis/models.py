from __future__ import annotations

from sqlalchemy import ForeignKey, JSON, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class RegionAnalysis(Base):
    __tablename__ = "region_analyses"

    session_id: Mapped[str] = mapped_column(ForeignKey("planning_sessions.id"), primary_key=True)
    region_id: Mapped[str] = mapped_column(ForeignKey("regions.id"), nullable=False)
    site_suitability_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    risk_index: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    expansion_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    logistics_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    strengths: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    red_flags: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    derived_metrics: Mapped[dict[str, float]] = mapped_column(JSON, nullable=False, default=dict)
    analysis_summary: Mapped[str] = mapped_column(Text, nullable=False)

    session = relationship("PlanningSession", back_populates="analysis")
    region = relationship("Region")

