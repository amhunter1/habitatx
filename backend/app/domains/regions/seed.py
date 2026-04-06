from __future__ import annotations

from app.domains.regions.models import Region


REGION_SEED_DATA = [
    Region(
        id="planum_boreum",
        display_name="Planum Boreum",
        sector="Sektör 01",
        summary=(
            "Kuzey kutup başlığına çok yakın, su buzu erişimi en güçlü saha. "
            "Radyasyon ve termal baskı nedeniyle yüzey yerine yarı gömülü veya yer altı habitatı için öncelikli aday."
        ),
        slope=5.4,
        roughness=34,
        crater_density=22,
        radiation_estimate=31,
        dust_risk=38,
        ice_probability=0.96,
        thermal_range=78,
        solar_efficiency=49,
        landing_safety=61,
        expansion_area=68,
        construction_feasibility=58,
        map_position_x=0.49,
        map_position_y=0.12,
    ),
    Region(
        id="arcadia_planitia",
        display_name="Arcadia Planitia",
        sector="Sektör 07",
        summary=(
            "Kuzey orta-yüksek enlem hattında, gömülü buz erişimi ile lojistik dengeyi birlikte sunan güçlü aday. "
            "İlk kalıcı su çıkarımı ve kontrollü büyüme için en dengeli kutup koridoru."
        ),
        slope=4.7,
        roughness=28,
        crater_density=20,
        radiation_estimate=33,
        dust_risk=44,
        ice_probability=0.88,
        thermal_range=64,
        solar_efficiency=66,
        landing_safety=79,
        expansion_area=83,
        construction_feasibility=76,
        map_position_x=0.67,
        map_position_y=0.28,
    ),
    Region(
        id="deuteronilus_mensae",
        display_name="Deuteronilus Mensae",
        sector="Sektör 11",
        summary=(
            "Buz açısından zengin yüksek enlem geçiş kuşağı. Arazisi daha karmaşık olsa da doğal örtü, yamaç koruması "
            "ve olası boşluk araştırmaları için stratejik değeri yüksek."
        ),
        slope=7.1,
        roughness=49,
        crater_density=35,
        radiation_estimate=32,
        dust_risk=47,
        ice_probability=0.91,
        thermal_range=69,
        solar_efficiency=61,
        landing_safety=63,
        expansion_area=71,
        construction_feasibility=59,
        map_position_x=0.58,
        map_position_y=0.24,
    ),
]
