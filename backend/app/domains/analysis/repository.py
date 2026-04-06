from __future__ import annotations

from sqlalchemy.orm import Session

from app.domains.analysis.models import RegionAnalysis


class RegionAnalysisRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_session_id(self, session_id: str) -> RegionAnalysis | None:
        return self.db.query(RegionAnalysis).filter(RegionAnalysis.session_id == session_id).one_or_none()

    def save(self, analysis: RegionAnalysis) -> RegionAnalysis:
        self.db.add(analysis)
        self.db.commit()
        self.db.refresh(analysis)
        return analysis

