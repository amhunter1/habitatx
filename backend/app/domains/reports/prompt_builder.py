from __future__ import annotations

from app.domains.analysis.schemas import RegionAnalysisRead
from app.domains.planning.schemas import CityPlanRead, ScoreCardRead
from app.domains.scenarios.schemas import PlanScenarioRead
from app.domains.sessions.schemas import MissionBriefRead, PlanningSessionRead


class ReportPromptBuilder:
    def build_payload(
        self,
        session: PlanningSessionRead,
        mission_brief: MissionBriefRead | None,
        analysis: RegionAnalysisRead,
        plan: CityPlanRead,
        score_card: ScoreCardRead,
        scenarios: list[PlanScenarioRead],
        sections: list[dict[str, str]],
        topic_briefs: list[dict[str, str]],
        estimated_cost: dict[str, float | int | str],
    ) -> dict[str, object]:
        return {
            "session": {
                "id": session.id,
                "risk_profile": session.risk_profile,
                "crew_size": session.crew_size,
                "mission_duration_months": session.mission_duration_months,
            },
            "mission_brief": mission_brief.model_dump() if mission_brief else None,
            "analysis": analysis.model_dump(),
            "plan": {
                "headline": plan.headline,
                "top_recommendations": plan.top_recommendations,
                "key_constraints": plan.key_constraints,
                "resource_bottlenecks": plan.resource_bottlenecks,
            },
            "score_card": score_card.model_dump(),
            "scenarios": [scenario.model_dump() for scenario in scenarios],
            "estimated_cost": estimated_cost,
            "sections": sections,
            "topic_briefs": topic_briefs,
        }
