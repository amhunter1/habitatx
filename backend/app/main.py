from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.planning_sessions import router as planning_sessions_router
from app.api.regions import router as regions_router
from app.domains.analysis.models import RegionAnalysis
from app.config import get_settings
from app.db import Base, SessionLocal, engine
from app.domains.planning.models import CityPhase, CityPlan, ModuleRecommendation, ScoreCard
from app.domains.regions.models import Region
from app.domains.reports.models import AIReport
from app.domains.scenarios.models import PlanScenario
from app.domains.regions.seed import REGION_SEED_DATA


def seed_regions() -> None:
    db = SessionLocal()
    try:
        has_region = db.query(Region.id).first()
        if has_region is None:
            db.add_all(REGION_SEED_DATA)
            db.commit()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    seed_regions()
    yield


settings = get_settings()
app = FastAPI(title=settings.app_name, lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(regions_router)
app.include_router(planning_sessions_router)


@app.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok", "environment": settings.app_env}

