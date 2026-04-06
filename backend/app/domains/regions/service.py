from __future__ import annotations

from sqlalchemy.orm import Session

from app.domains.regions.repository import RegionRepository
from app.domains.regions.schemas import RegionRead


class RegionService:
    def __init__(self, db: Session):
        self.repository = RegionRepository(db)

    def list_regions(self) -> list[RegionRead]:
        return [RegionRead.model_validate(region) for region in self.repository.list()]

