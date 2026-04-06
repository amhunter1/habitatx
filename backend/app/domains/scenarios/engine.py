from __future__ import annotations

from app.domains.analysis.rules import clamp, round_score
from app.domains.analysis.schemas import RegionAnalysisRead
from app.domains.planning.schemas import ScoreCardRead
from app.domains.scenarios.models import PlanScenario
from app.domains.sessions.schemas import PlanningSessionRead


class ScenarioEngine:
    def build_scenarios(
        self,
        session: PlanningSessionRead,
        analysis: RegionAnalysisRead,
        score_card: ScoreCardRead,
    ) -> list[PlanScenario]:
        base_fit = score_card.mission_fit_score
        base_risk = analysis.risk_index
        base_autonomy = score_card.autonomy_score
        cost_discipline = 100 - clamp(session.crew_size / 60 * 35 + session.mission_duration_months / 96 * 25)

        return [
            PlanScenario(
                session_id=session.id,
                scenario_name="Korunakli",
                optimization_target="Risk azaltma",
                mission_fit_score=round_score(base_fit + 3),
                risk_index=round_score(base_risk - 8),
                autonomy_score=round_score(base_autonomy - 6),
                cost_discipline_score=round_score(cost_discipline + 6),
                summary="Yedeklilik, koruma ve enerji tamponu ağırlıklı varyant.",
            ),
            PlanScenario(
                session_id=session.id,
                scenario_name="Dengeli",
                optimization_target="Genel performans",
                mission_fit_score=round_score(base_fit),
                risk_index=round_score(base_risk),
                autonomy_score=round_score(base_autonomy),
                cost_discipline_score=round_score(cost_discipline),
                summary="Kaynak, büyüme ve operasyon yükleri arasında orta denge kuran ana varyant.",
            ),
            PlanScenario(
                session_id=session.id,
                scenario_name="Agresif Buyume",
                optimization_target="Hizli genisleme",
                mission_fit_score=round_score(base_fit - 5),
                risk_index=round_score(base_risk + 10),
                autonomy_score=round_score(base_autonomy + 8),
                cost_discipline_score=round_score(cost_discipline - 12),
                summary="Yerel üretim ve kapasite artışına öncelik veren, daha yüksek riskli varyant.",
            ),
        ]
