from __future__ import annotations

from sqlalchemy.orm import Session

from app.domains.regions.models import Region


class RegionRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self) -> list[Region]:
        return self.db.query(Region).order_by(Region.display_name.asc()).all()

    def get(self, region_id: str) -> Region | None:
        return self.db.query(Region).filter(Region.id == region_id).one_or_none()

    def create_many(self, regions: list[Region]) -> None:
        self.db.add_all(regions)
        self.db.commit()

