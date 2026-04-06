from __future__ import annotations

from app.domains.planning.models import CityPhase, ModuleRecommendation


def build_city_phases(city_plan_id: str, modules: list[ModuleRecommendation]) -> list[CityPhase]:
    phase_map: dict[str, list[str]] = {"Faz I": [], "Faz II": [], "Faz III": []}
    for module in modules:
        phase_map.setdefault(module.phase_fit, []).append(module.module_name)

    return [
        CityPhase(
            city_plan_id=city_plan_id,
            phase_order=1,
            phase_name="Faz I",
            objective="İniş, yaşam desteği ve ilk koruma omurgasını devreye almak.",
            deliverables=phase_map.get("Faz I", []),
        ),
        CityPhase(
            city_plan_id=city_plan_id,
            phase_order=2,
            phase_name="Faz II",
            objective="Kaynak bağımsızlığını ve bakım sürekliliğini stabilize etmek.",
            deliverables=phase_map.get("Faz II", []),
        ),
        CityPhase(
            city_plan_id=city_plan_id,
            phase_order=3,
            phase_name="Faz III",
            objective="Üretim, gıda ve yerleşim genişlemesini hızlandırmak.",
            deliverables=phase_map.get("Faz III", []),
        ),
    ]
