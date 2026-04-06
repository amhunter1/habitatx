from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.domains.regions.schemas import RegionRead
from app.domains.regions.service import RegionService

router = APIRouter(prefix="/regions", tags=["regions"])


@router.get("", response_model=list[RegionRead])
def list_regions(db: Session = Depends(get_db)) -> list[RegionRead]:
    service = RegionService(db)
    return service.list_regions()

