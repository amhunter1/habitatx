from __future__ import annotations

from app.domains.analysis.models import RegionAnalysis
from app.domains.planning.models import CityPlan, ModuleRecommendation
from app.domains.planning.module_catalog import MODULE_CATALOG
from app.domains.sessions.models import MissionBrief, PlanningSession


class PlanningEngine:
    def build_plan(
        self,
        session: PlanningSession,
        analysis: RegionAnalysis,
    ) -> tuple[CityPlan, list[ModuleRecommendation], float]:
        module_codes = self._select_modules(session, analysis)
        modules = [self._to_module(city_plan_id="", module_code=code) for code in module_codes]
        reserve_policy_score = self._reserve_policy_score(session.risk_profile)
        constraints = self._build_constraints(session, analysis)
        bottlenecks = self._build_resource_bottlenecks(session, analysis)
        recommendations = self._build_top_recommendations(module_codes, analysis)

        plan = CityPlan(
            session_id=session.id,
            scenario_type=session.risk_profile,
            headline=f"{session.risk_profile.replace('_', ' ').title()} plan / {session.region.display_name}",
            top_recommendations=recommendations,
            key_constraints=constraints,
            resource_bottlenecks=bottlenecks,
            planner_rationale=self._build_rationale(session, analysis, module_codes),
        )
        return plan, modules, reserve_policy_score

    def attach_plan_id(self, modules: list[ModuleRecommendation], city_plan_id: str) -> list[ModuleRecommendation]:
        hydrated: list[ModuleRecommendation] = []
        for module in modules:
            hydrated.append(
                ModuleRecommendation(
                    city_plan_id=city_plan_id,
                    module_code=module.module_code,
                    module_name=module.module_name,
                    category=module.category,
                    phase_fit=module.phase_fit,
                    capacity_note=module.capacity_note,
                    energy_load=module.energy_load,
                    reason=module.reason,
                )
            )
        return hydrated

    def _select_modules(self, session: PlanningSession, analysis: RegionAnalysis) -> list[str]:
        mission_brief: MissionBrief | None = session.mission_brief
        autonomy_level = (
            mission_brief.autonomy_level if mission_brief and mission_brief.autonomy_level is not None else 50
        )
        risk_tolerance = (
            mission_brief.risk_tolerance if mission_brief and mission_brief.risk_tolerance is not None else 50
        )

        selected = ["hab_core", "power_hub", "maintenance_hangar"]
        if session.crew_size >= 32:
            selected.append("hab_core_2")
        if session.mission_duration_months >= 48:
            selected.append("isru_water")
        if session.mission_duration_months >= 60 or session.risk_profile == "agresif_buyume":
            selected.append("agri_ring")
        if autonomy_level >= 70:
            selected.append("manufacturing_pod")
        if risk_tolerance <= 40 or session.risk_profile == "korunakli":
            selected.append("regolith_shield")
            selected.append("life_support_redundancy")
        if analysis.risk_index >= 45 or analysis.derived_metrics["normalized_radiation"] <= 55:
            selected.append("regolith_shield")
        if analysis.risk_index >= 40 or analysis.logistics_score <= 72:
            selected.append("battery_bank")

        return list(dict.fromkeys(selected))

    def _to_module(self, city_plan_id: str, module_code: str) -> ModuleRecommendation:
        config = MODULE_CATALOG[module_code]
        return ModuleRecommendation(city_plan_id=city_plan_id, module_code=module_code, **config)

    def _reserve_policy_score(self, risk_profile: str) -> float:
        mapping = {"korunakli": 88.0, "dengeli": 72.0, "agresif_buyume": 58.0}
        return mapping.get(risk_profile, 70.0)

    def _build_constraints(self, session: PlanningSession, analysis: RegionAnalysis) -> list[str]:
        constraints = []
        if analysis.risk_index >= 40:
            constraints.append("Toz ve radyasyon etkileri enerji tamponunu büyütüyor.")
        if session.mission_duration_months >= 60:
            constraints.append("Uzun görev süresi Faz II kaynak altyapısını kritik hale getiriyor.")
        if session.crew_size >= 32:
            constraints.append("Artan ekip boyutu habitat ve bakım kapasitesini öne taşıyor.")
        if not constraints:
            constraints.append("Ana kısıt ilk faz kaynak dağıtımının dengeli korunması.")
        return constraints

    def _build_resource_bottlenecks(self, session: PlanningSession, analysis: RegionAnalysis) -> list[str]:
        bottlenecks = []
        if analysis.derived_metrics["normalized_ice"] < 55:
            bottlenecks.append("Su bağımsızlığı için daha agresif geri kazanım zinciri gerekli.")
        if analysis.risk_index >= 40:
            bottlenecks.append("Enerji depolama ve bakım servis kapasitesi darboğaz yaratabilir.")
        if session.mission_duration_months >= 72:
            bottlenecks.append("Uzun operasyon periyodu sarf malzeme ve yedek parça baskısını artırır.")
        if not bottlenecks:
            bottlenecks.append("Kaynak akışı dengeli, ancak Faz II gecikmesi bütün plana etki eder.")
        return bottlenecks

    def _build_top_recommendations(self, module_codes: list[str], analysis: RegionAnalysis) -> list[str]:
        recommendations = []
        if "regolith_shield" in module_codes:
            recommendations.append("Regolit kalkanını ilk fazda başlat ve yaşam çekirdeğiyle birlikte kilitle.")
        if "isru_water" in module_codes:
            recommendations.append("Su çıkarma hattını Faz II başında devreye alarak uzun kalış riskini azalt.")
        if "manufacturing_pod" in module_codes:
            recommendations.append("Üretim podunu bakım otomasyonu yeterli seviyeye gelince Faz III'te büyüt.")
        if analysis.risk_index >= 40:
            recommendations.append("Toz haftaları için batarya ve bakım rezervini erken sabitle.")
        if not recommendations:
            recommendations.append("Kaynak, habitat ve enerji fazlamasını dengeli ritimde ilerlet.")
        return recommendations[:3]

    def _build_rationale(self, session: PlanningSession, analysis: RegionAnalysis, module_codes: list[str]) -> str:
        return (
            f"{session.region.display_name} için plan; saha uygunluğu {analysis.site_suitability_score} ve "
            f"risk indeksi {analysis.risk_index} dengesine göre kurgulandı. "
            f"Seçilen {len(module_codes)} modül, ekip boyutu {session.crew_size} ve "
            f"{session.mission_duration_months} aylık operasyon hedefine göre fazlandı."
        )
