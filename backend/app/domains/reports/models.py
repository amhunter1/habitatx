from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, JSON, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class AIReport(Base):
    __tablename__ = "ai_reports"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id: Mapped[str] = mapped_column(ForeignKey("planning_sessions.id"), nullable=False, unique=True)
    executive_summary: Mapped[str] = mapped_column(Text, nullable=False)
    technical_summary: Mapped[str] = mapped_column(Text, nullable=False)
    next_actions: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    report_payload: Mapped[dict[str, object]] = mapped_column(JSON, nullable=False, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    session = relationship("PlanningSession", back_populates="ai_report")

