from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class AIReportRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    session_id: str
    executive_summary: str
    technical_summary: str
    next_actions: list[str]
    report_payload: dict[str, object]
    created_at: datetime

