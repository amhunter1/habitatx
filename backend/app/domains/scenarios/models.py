from __future__ import annotations

import uuid

from sqlalchemy import ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class PlanScenario(Base):
    __tablename__ = "plan_scenarios"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id: Mapped[str] = mapped_column(ForeignKey("planning_sessions.id"), nullable=False)
    scenario_name: Mapped[str] = mapped_column(String(64), nullable=False)
    optimization_target: Mapped[str] = mapped_column(String(128), nullable=False)
    mission_fit_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    risk_index: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    autonomy_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    cost_discipline_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=False)

    session = relationship("PlanningSession", back_populates="scenarios")

