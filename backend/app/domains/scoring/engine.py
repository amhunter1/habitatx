from __future__ import annotations

from app.domains.analysis.models import RegionAnalysis
from app.domains.analysis.rules import clamp, round_score
from app.domains.planning.models import ScoreCard
from app.domains.sessions.models import PlanningSession


class ScoreCardEngine:
    def build_score_card(
        self,
        session: PlanningSession,
        analysis: RegionAnalysis,
        module_codes: list[str],
        reserve_policy_score: float,
    ) -> ScoreCard:
        mission_brief = session.mission_brief
        autonomy_level = (
            mission_brief.autonomy_level if mission_brief and mission_brief.autonomy_level is not None else 50
        )
        robot_count = mission_brief.robot_count if mission_brief and mission_brief.robot_count is not None else 8
        resupply_dependence = (
            mission_brief.resupply_dependence if mission_brief and mission_brief.resupply_dependence is not None else 50
        )
        site_suitability_score = float(analysis.site_suitability_score)
        logistics_score = float(analysis.logistics_score)
        expansion_score = float(analysis.expansion_score)
        risk_index = float(analysis.risk_index)
        normalized_ice = float(analysis.derived_metrics["normalized_ice"])
        normalized_slope = float(analysis.derived_metrics["normalized_slope"])
        roughness_inverse = float(analysis.derived_metrics["roughness_inverse"])

        local_production_bonus = 12 if "manufacturing_pod" in module_codes else 0
        water_bonus = 10 if "isru_water" in module_codes else 0
        food_bonus = 10 if "agri_ring" in module_codes else 0
        energy_bonus = 8 if "battery_bank" in module_codes else 0
        protection_bonus = 10 if "regolith_shield" in module_codes else 0

        mission_fit_score = round_score(
            0.36 * site_suitability_score
            + 0.16 * clamp(session.crew_size / 60 * 100)
            + 0.16 * clamp(session.mission_duration_months / 96 * 100)
            + 0.16 * autonomy_level
            + 0.16 * reserve_policy_score
        )
        resource_access_score = round_score(
            0.38 * logistics_score + 0.34 * normalized_ice + 0.14 * energy_bonus + 0.14 * water_bonus
        )
        construction_difficulty = round_score(
            0.45 * (100 - normalized_slope)
            + 0.35 * (100 - roughness_inverse)
            + 0.20 * (15 if len(module_codes) >= 6 else 8)
        )
        resilience_score = round_score(
            0.55 * reserve_policy_score
            + 0.20 * protection_bonus
            + 0.15 * energy_bonus
            + 0.10 * water_bonus
        )
        autonomy_score = round_score(
            0.55 * autonomy_level
            + 0.20 * clamp(robot_count * 3)
            + 0.15 * local_production_bonus
            + 0.10 * (100 - resupply_dependence)
        )
        sustainability_score = round_score(
            0.40 * water_bonus + 0.25 * food_bonus + 0.20 * energy_bonus + 0.15 * autonomy_level
        )
        survival_confidence = round_score(
            0.20 * site_suitability_score
            + 0.15 * resource_access_score
            + 0.15 * resilience_score
            + 0.15 * autonomy_score
            + 0.15 * expansion_score
            + 0.20 * (100 - risk_index)
        )

        return ScoreCard(
            session_id=session.id,
            site_suitability_score=site_suitability_score,
            mission_fit_score=mission_fit_score,
            resource_access_score=resource_access_score,
            risk_index=risk_index,
            construction_difficulty=construction_difficulty,
            resilience_score=resilience_score,
            autonomy_score=autonomy_score,
            expansion_score=expansion_score,
            sustainability_score=sustainability_score,
            survival_confidence=survival_confidence,
        )
