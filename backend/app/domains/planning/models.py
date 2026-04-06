from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, JSON, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class CityPlan(Base):
    __tablename__ = "city_plans"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id: Mapped[str] = mapped_column(ForeignKey("planning_sessions.id"), nullable=False, unique=True)
    scenario_type: Mapped[str] = mapped_column(String(32), nullable=False)
    headline: Mapped[str] = mapped_column(String(255), nullable=False)
    top_recommendations: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    key_constraints: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    resource_bottlenecks: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    planner_rationale: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    phases: Mapped[list["CityPhase"]] = relationship(
        back_populates="city_plan",
        cascade="all, delete-orphan",
        order_by="CityPhase.phase_order",
    )
    modules: Mapped[list["ModuleRecommendation"]] = relationship(
        back_populates="city_plan",
        cascade="all, delete-orphan",
    )
    session = relationship("PlanningSession", back_populates="city_plan")


class CityPhase(Base):
    __tablename__ = "city_phases"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    city_plan_id: Mapped[str] = mapped_column(ForeignKey("city_plans.id"), nullable=False)
    phase_order: Mapped[int] = mapped_column(Integer, nullable=False)
    phase_name: Mapped[str] = mapped_column(String(64), nullable=False)
    objective: Mapped[str] = mapped_column(Text, nullable=False)
    deliverables: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)

    city_plan: Mapped[CityPlan] = relationship(back_populates="phases")


class ModuleRecommendation(Base):
    __tablename__ = "module_recommendations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    city_plan_id: Mapped[str] = mapped_column(ForeignKey("city_plans.id"), nullable=False)
    module_code: Mapped[str] = mapped_column(String(64), nullable=False)
    module_name: Mapped[str] = mapped_column(String(128), nullable=False)
    category: Mapped[str] = mapped_column(String(64), nullable=False)
    phase_fit: Mapped[str] = mapped_column(String(32), nullable=False)
    capacity_note: Mapped[str] = mapped_column(String(128), nullable=False)
    energy_load: Mapped[str] = mapped_column(String(32), nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False)

    city_plan: Mapped[CityPlan] = relationship(back_populates="modules")


class ScoreCard(Base):
    __tablename__ = "score_cards"

    session_id: Mapped[str] = mapped_column(ForeignKey("planning_sessions.id"), primary_key=True)
    site_suitability_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    mission_fit_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    resource_access_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    risk_index: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    construction_difficulty: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    resilience_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    autonomy_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    expansion_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    sustainability_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    survival_confidence: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)

    session = relationship("PlanningSession", back_populates="score_card")

