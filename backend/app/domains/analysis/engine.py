from __future__ import annotations

from app.domains.analysis.rules import clamp, round_score
from app.domains.analysis.schemas import RegionAnalysisRead
from app.domains.regions.models import Region


class RegionAnalysisEngine:
    def build_analysis(self, session_id: str, region: Region) -> RegionAnalysisRead:
        normalized_slope = 100 - clamp(region.slope * 10)
        normalized_radiation = 100 - clamp(region.radiation_estimate)
        normalized_ice = clamp(region.ice_probability * 100)
        roughness_inverse = 100 - clamp(region.roughness)

        site_suitability_score = round_score(
            0.22 * region.landing_safety
            + 0.18 * normalized_slope
            + 0.15 * normalized_radiation
            + 0.15 * normalized_ice
            + 0.15 * region.solar_efficiency
            + 0.15 * region.construction_feasibility
        )
        risk_index = round_score(
            0.30 * region.dust_risk
            + 0.30 * region.radiation_estimate
            + 0.20 * region.crater_density
            + 0.20 * region.roughness
        )
        expansion_score = round_score(
            0.55 * region.expansion_area
            + 0.25 * region.construction_feasibility
            + 0.20 * normalized_slope
        )
        logistics_score = round_score(
            0.50 * region.landing_safety
            + 0.30 * normalized_slope
            + 0.20 * roughness_inverse
        )

        strengths = self._build_strengths(
            region=region,
            site_suitability_score=site_suitability_score,
            expansion_score=expansion_score,
            logistics_score=logistics_score,
        )
        red_flags = self._build_red_flags(region)
        derived_metrics = {
            "normalized_slope": round_score(normalized_slope),
            "normalized_radiation": round_score(normalized_radiation),
            "normalized_ice": round_score(normalized_ice),
            "roughness_inverse": round_score(roughness_inverse),
        }
        analysis_summary = self._build_summary(
            region=region,
            site_suitability_score=site_suitability_score,
            risk_index=risk_index,
            expansion_score=expansion_score,
            logistics_score=logistics_score,
            red_flags=red_flags,
        )

        return RegionAnalysisRead(
            session_id=session_id,
            region_id=region.id,
            site_suitability_score=site_suitability_score,
            risk_index=risk_index,
            expansion_score=expansion_score,
            logistics_score=logistics_score,
            strengths=strengths,
            red_flags=red_flags,
            derived_metrics=derived_metrics,
            analysis_summary=analysis_summary,
        )

    def _build_strengths(
        self,
        region: Region,
        site_suitability_score: float,
        expansion_score: float,
        logistics_score: float,
    ) -> list[str]:
        strengths: list[str] = []

        if site_suitability_score >= 80:
            strengths.append("İlk kurulum için yüksek saha uygunluğu sunuyor.")
        if expansion_score >= 80:
            strengths.append("Faz bazlı şehir genişlemesi için güçlü alan rezervi sağlıyor.")
        if logistics_score >= 75:
            strengths.append("İniş, taşıma ve ilk operasyon akışı için elverişli lojistik pencere veriyor.")
        if region.ice_probability >= 0.65:
            strengths.append("Yerel su stratejisi için güçlü buz erişimi sağlıyor.")
        if region.solar_efficiency >= 78:
            strengths.append("Solar altyapıyı erken fazlarda verimli destekleyebiliyor.")

        if not strengths:
            strengths.append("Dengeli bir aday bölge, ancak avantajları dikkatli fazlama ile açığa çıkıyor.")

        return strengths

    def _build_red_flags(self, region: Region) -> list[str]:
        red_flags: list[str] = []

        if region.radiation_estimate > 70:
            red_flags.append("Uzun kalış için ek koruma gerekli.")
        if region.dust_risk > 65:
            red_flags.append("Enerji ve bakım rezervi zorunlu.")
        if region.landing_safety < 55:
            red_flags.append("İniş operasyonu kontrollü mod gerektirir.")
        if region.ice_probability < 0.45:
            red_flags.append("Su stratejisi agresif geri kazanıma kayar.")
        if region.roughness > 40:
            red_flags.append("Yüzey hazırlığı ve bakım yükleri ilk faz maliyetini artırır.")

        if not red_flags:
            red_flags.append("Belirgin kırmızı bayrak yok, ancak radyasyon ve toz tamponu korunmalı.")

        return red_flags

    def _build_summary(
        self,
        region: Region,
        site_suitability_score: float,
        risk_index: float,
        expansion_score: float,
        logistics_score: float,
        red_flags: list[str],
    ) -> str:
        summary = (
            f"{region.display_name}, saha uygunluğu {site_suitability_score} ve lojistik skoru "
            f"{logistics_score} ile ilk kurulum için güçlü bir pencere sunuyor. "
            f"Risk indeksi {risk_index} seviyesinde kalırken genişleme skoru {expansion_score} "
            "ölçeğinde orta-uzun vadeli büyümeyi destekliyor."
        )
        if red_flags:
            summary += f" Ana dikkat noktası: {red_flags[0]}"
        return summary
