from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class PlanningSession(Base):
    __tablename__ = "planning_sessions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    status: Mapped[str] = mapped_column(String(32), default="draft", nullable=False)
    selected_region_id: Mapped[str] = mapped_column(ForeignKey("regions.id"), nullable=False)
    crew_size: Mapped[int] = mapped_column(Integer, nullable=False)
    mission_duration_months: Mapped[int] = mapped_column(Integer, nullable=False)
    risk_profile: Mapped[str] = mapped_column(String(32), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    mission_brief: Mapped["MissionBrief | None"] = relationship(
        back_populates="session",
        cascade="all, delete-orphan",
        uselist=False,
    )
    analysis: Mapped["RegionAnalysis | None"] = relationship(
        back_populates="session",
        cascade="all, delete-orphan",
        uselist=False,
    )
    city_plan: Mapped["CityPlan | None"] = relationship(
        back_populates="session",
        cascade="all, delete-orphan",
        uselist=False,
    )
    score_card: Mapped["ScoreCard | None"] = relationship(
        back_populates="session",
        cascade="all, delete-orphan",
        uselist=False,
    )
    scenarios: Mapped[list["PlanScenario"]] = relationship(
        back_populates="session",
        cascade="all, delete-orphan",
    )
    ai_report: Mapped["AIReport | None"] = relationship(
        back_populates="session",
        cascade="all, delete-orphan",
        uselist=False,
    )
    region = relationship("Region")


class MissionBrief(Base):
    __tablename__ = "mission_briefs"

    session_id: Mapped[str] = mapped_column(ForeignKey("planning_sessions.id"), primary_key=True)
    mission_purpose: Mapped[str | None] = mapped_column(String(64))
    target_population: Mapped[int | None] = mapped_column(Integer)
    energy_strategy: Mapped[str | None] = mapped_column(String(64))
    habitat_type: Mapped[str | None] = mapped_column(String(64))
    water_strategy: Mapped[str | None] = mapped_column(String(64))
    food_strategy: Mapped[str | None] = mapped_column(String(64))
    autonomy_level: Mapped[int | None] = mapped_column(Integer)
    robot_count: Mapped[int | None] = mapped_column(Integer)
    resupply_dependence: Mapped[int | None] = mapped_column(Integer)
    risk_tolerance: Mapped[int | None] = mapped_column(Integer)
    growth_target: Mapped[str | None] = mapped_column(String(64))

    session: Mapped[PlanningSession] = relationship(back_populates="mission_brief")

