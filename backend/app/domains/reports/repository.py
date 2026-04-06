from __future__ import annotations

from sqlalchemy.orm import Session

from app.domains.reports.models import AIReport


class ReportRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_session_id(self, session_id: str) -> AIReport | None:
        return self.db.query(AIReport).filter(AIReport.session_id == session_id).one_or_none()

    def save(self, report: AIReport) -> AIReport:
        self.db.add(report)
        self.db.commit()
        self.db.refresh(report)
        return report

