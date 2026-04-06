# HabitatX Backend Sistem Raporu

## 1. Amaç

HabitatX, Mars uzerinde otonom sehir habitat planlamasi yapan bir karar destek sistemidir. Frontend artik sade bir akisa indirildigi icin backend'in temel gorevi tek bir gercek kaynak olmaktir:

- kullanicinin secimlerini session bazli saklamak
- bolge analizini uretmek
- gorev brief'ine gore plan olusturmak
- alternatif senaryolari hesaplamak
- AI raporu ve export ciktisi uretmek

Bu rapor, mevcut frontend akisina uygun uygulanabilir backend yapisini tanimlar.

## 2. Uygulama Akisi

Yeni UX akisi:

1. Ana Merkez
   - bolge secimi
   - ekip buyuklugu
   - gorev suresi
   - risk profili
2. Gorev Brief'i
   - gelismis operasyon parametreleri
3. Analiz
   - secilen bolgenin yorumlanmis analizi
4. Plan
   - sehir plani
   - risk ve kaynak
   - senaryo karsilastirma
5. Rapor
   - AI ozet
   - export hazirligi

Bu akis backend tarafinda tek bir `planning_session` etrafinda doner.

## 3. Domain Omurgasi

### 3.1 PlanningSession

Butun kullanici kararlarinin baglandigi ana varliktir.

| Alan | Tip | Aciklama |
| --- | --- | --- |
| `id` | UUID | session kimligi |
| `status` | enum | `draft`, `analysis_ready`, `plan_ready`, `report_ready` |
| `selected_region_id` | text | aktif bolge |
| `crew_size` | int | quickstart ekip boyutu |
| `mission_duration_months` | int | quickstart gorev suresi |
| `risk_profile` | text | `korunakli`, `dengeli`, `agresif_buyume` |
| `created_at` | timestamptz | olusma zamani |
| `updated_at` | timestamptz | son guncelleme |

### 3.2 MissionBrief

Quickstart sonrasi detayli planlama parametrelerini tasir.

| Alan | Tip |
| --- | --- |
| `session_id` | UUID |
| `mission_purpose` | text |
| `target_population` | int |
| `energy_strategy` | text |
| `habitat_type` | text |
| `water_strategy` | text |
| `food_strategy` | text |
| `autonomy_level` | int |
| `robot_count` | int |
| `resupply_dependence` | int |
| `risk_tolerance` | int |
| `growth_target` | text |

### 3.3 Region

Frontend'deki Mars secimi icin sabit katalog verisidir.

| Alan | Tip |
| --- | --- |
| `id` | text |
| `display_name` | text |
| `sector` | text |
| `summary` | text |
| `slope` | numeric |
| `roughness` | numeric |
| `crater_density` | numeric |
| `radiation_estimate` | numeric |
| `dust_risk` | numeric |
| `ice_probability` | numeric |
| `solar_efficiency` | numeric |
| `landing_safety` | numeric |
| `expansion_area` | numeric |
| `construction_feasibility` | numeric |
| `map_position_x` | numeric |
| `map_position_y` | numeric |

### 3.4 RegionAnalysis

Secilen bolge icin yorumlanmis analiz ciktisidir.

| Alan | Tip |
| --- | --- |
| `session_id` | UUID |
| `region_id` | text |
| `site_suitability_score` | numeric |
| `risk_index` | numeric |
| `expansion_score` | numeric |
| `logistics_score` | numeric |
| `strengths` | jsonb |
| `red_flags` | jsonb |
| `derived_metrics` | jsonb |
| `analysis_summary` | text |

### 3.5 CityPlan

Plan motorunun ana ciktisidir.

| Alan | Tip |
| --- | --- |
| `id` | UUID |
| `session_id` | UUID |
| `scenario_type` | text |
| `headline` | text |
| `top_recommendations` | jsonb |
| `key_constraints` | jsonb |
| `resource_bottlenecks` | jsonb |
| `planner_rationale` | text |
| `created_at` | timestamptz |

### 3.6 CityPhase

Her planin faz bazli kurulum adimlarini tutar.

| Alan | Tip |
| --- | --- |
| `id` | UUID |
| `city_plan_id` | UUID |
| `phase_order` | int |
| `phase_name` | text |
| `objective` | text |
| `deliverables` | jsonb |

### 3.7 ModuleRecommendation

Plan icerisinde onerilen habitat ve altyapi modullerini tasir.

| Alan | Tip |
| --- | --- |
| `id` | UUID |
| `city_plan_id` | UUID |
| `module_code` | text |
| `module_name` | text |
| `category` | text |
| `phase_fit` | text |
| `capacity_note` | text |
| `energy_load` | text |
| `reason` | text |

### 3.8 PlanScenario

Ayni session icin alternatif plan varyantlarini tutar.

| Alan | Tip |
| --- | --- |
| `id` | UUID |
| `session_id` | UUID |
| `scenario_name` | text |
| `optimization_target` | text |
| `mission_fit_score` | numeric |
| `risk_index` | numeric |
| `autonomy_score` | numeric |
| `cost_discipline_score` | numeric |
| `summary` | text |

### 3.9 ScoreCard

UI'de farkli ekranlarda kullanilacak normalize skor setidir.

| Alan | Tip |
| --- | --- |
| `session_id` | UUID |
| `site_suitability_score` | numeric |
| `mission_fit_score` | numeric |
| `resource_access_score` | numeric |
| `risk_index` | numeric |
| `construction_difficulty` | numeric |
| `resilience_score` | numeric |
| `autonomy_score` | numeric |
| `expansion_score` | numeric |
| `sustainability_score` | numeric |
| `survival_confidence` | numeric |

### 3.10 AIReport

Yonetici ozeti ve teknik ozetin saklandigi yapidir.

| Alan | Tip |
| --- | --- |
| `id` | UUID |
| `session_id` | UUID |
| `executive_summary` | text |
| `technical_summary` | text |
| `next_actions` | jsonb |
| `report_payload` | jsonb |
| `created_at` | timestamptz |

## 4. Session Modeli

`planning_session`, frontend tekrarlarini backend uzerinde toplar.

### Session davranisi

- Kullanici ilk acilista yeni session alir.
- Ana merkezdeki tum secimler `PATCH /planning-sessions/:id/quickstart` ile ayni kayda yazilir.
- Gorev brief'i ayri endpoint ile guncellenir.
- Analiz, plan ve rapor ciktisi session altinda birikir.
- Boylece frontend her ekranda yeniden veri girmez.

### Neden gerekli

- tek kaynak
- autosave kolayligi
- ekranlar arasi tutarlilik
- yeniden hesaplama mantigini kontrol etme
- export ve AI raporuna ayni veri seti ile gitme

## 5. Region Veri Sistemi

MVP icin `regions` tablosu sabit katalog olarak tutulur. Ilk surumde 3 bolge yeterlidir:

- `elysium_planitia`
- `arcadia_planitia`
- `utopia_planitia`

### Region metadata

Backend her bolge icin su kategorileri tutar:

- geometri / secim bilgisi
- fiziksel arazi bilgisi
- enerji ve kaynak bilgisi
- lojistik bilgisi
- genisleme bilgisi
- yorumlanmis ozet

### 3D secim uyumu

Gercek 3D mesh gerekmeden frontend ile backend arasinda su kontrat yeterli olur:

```json
{
  "region_id": "elysium_planitia",
  "display_name": "Elysium Planitia",
  "sector": "Sektor 14",
  "map_position": {
    "x": 0.68,
    "y": 0.44
  }
}
```

Frontend pin veya hotspot secimini `region_id` ile backend'e gonderir.

## 6. Region Analysis Engine

Analiz motoru, secilen bolgenin ham verisini yorumlu ciktıya cevirir.

### Input alanlari

- slope
- roughness
- crater_density
- radiation_estimate
- dust_risk
- ice_probability
- thermal_range
- solar_efficiency
- landing_safety
- expansion_area
- construction_feasibility

### Normalize etme

Tum alanlar 0-100 bandina tasinir:

- pozitif metriklerde yuksek daha iyi
- negatif metriklerde yuksek daha kotu

Ornek:

```text
normalized_slope = 100 - clamp(slope * 10, 0, 100)
normalized_radiation = 100 - radiation_estimate
normalized_ice = ice_probability * 100
```

### Uretilen skorlar

```text
site_suitability_score =
  0.22 * landing_safety +
  0.18 * normalized_slope +
  0.15 * normalized_radiation +
  0.15 * normalized_ice +
  0.15 * solar_efficiency +
  0.15 * construction_feasibility

risk_index =
  0.30 * dust_risk +
  0.30 * radiation_estimate +
  0.20 * crater_density +
  0.20 * roughness

expansion_score =
  0.55 * expansion_area +
  0.25 * construction_feasibility +
  0.20 * normalized_slope

logistics_score =
  0.50 * landing_safety +
  0.30 * normalized_slope +
  0.20 * roughness_inverse
```

### Red flag kurallari

- `radiation_estimate > 70` -> "uzun kalis icin ek koruma gerekli"
- `dust_risk > 65` -> "enerji ve bakim rezervi zorunlu"
- `landing_safety < 55` -> "inis operasyonu kontrollu mod gerektirir"
- `ice_probability < 0.45` -> "su stratejisi agresif geri kazanima kayar"

## 7. Mission Brief Katmanlari

### QuickStart

| Alan | Tip | Validation |
| --- | --- | --- |
| `region_id` | text | zorunlu |
| `crew_size` | int | 12-120 |
| `mission_duration_months` | int | 12-120 |
| `risk_profile` | text | enum |

### Advanced

| Alan | Tip | Ornek |
| --- | --- | --- |
| `mission_purpose` | text | `kalici_habitat` |
| `target_population` | int | 120 |
| `energy_strategy` | text | `solar_nuclear_hybrid` |
| `habitat_type` | text | `buried_modular` |
| `water_strategy` | text | `ice_extraction_plus_recycling` |
| `food_strategy` | text | `hybrid_bioregenerative` |
| `autonomy_level` | int | 74 |
| `robot_count` | int | 26 |
| `resupply_dependence` | int | 40 |
| `risk_tolerance` | int | 45 |
| `growth_target` | text | `phase_3_expansion` |

### Plan motoruna etkiler

- ekip artarsa yasam modul sayisi artar
- sure uzarsa su, gida ve bakim kapasitesi buyur
- dusuk risk toleransi daha fazla yedeklilik getirir
- yuksek otonomi uretim ve robotik modul bias'i ekler
- yuksek ikmal bagimliligi lokal uretimi geri iter

## 8. Planning Engine

Planning engine asagidaki sirada calisir:

1. session + mission brief'i oku
2. region analysis skorlarini cek
3. kurallari degerlendir
4. temel modulleri sec
5. fazlara dagit
6. kaynak darboğazlarini hesapla
7. top recommendations uret

### Temel kural ornekleri

```text
IF crew_size >= 48 THEN add "yasam_cekirdegi_2"
IF mission_duration_months >= 60 THEN add "isru_su_tesisi"
IF autonomy_level >= 70 THEN add "uretim_podu"
IF risk_tolerance <= 40 THEN add "regolit_kalkan_hatti"
IF dust_risk >= 60 THEN add "yedek_batarya_bankasi"
```

### Plan cikti JSON ornegi

```json
{
  "headline": "Dengeli plan / Elysium Planitia",
  "recommended_modules": [
    {
      "module_code": "hab_core",
      "module_name": "Yasam Cekirdegi",
      "phase_fit": "Faz I",
      "reason": "Ekip sayisi ve gorev suresi icin minimum yasam kapasitesi"
    },
    {
      "module_code": "isru_water",
      "module_name": "ISRU Su Tesisi",
      "phase_fit": "Faz II",
      "reason": "Uzun gorev suresi icin su guvencesi"
    }
  ],
  "key_constraints": [
    "Toz olayi sirasinda gunes verimi dusuyor",
    "Faz II icin bakim robotlari kritik"
  ],
  "top_recommendations": [
    "Regolit kalkanini ilk fazda baslat",
    "Su cikarma hattini Faz II basinda devreye al",
    "Uretim podunu bakim otomasyonu sonrasinda buyut"
  ]
}
```

## 9. Scenario Engine

Her session icin 3 standart plan varyanti uretilir.

### Korunakli

- optimizasyon: risk azaltma
- reserve policy: yuksek
- module bias: kalkan, yedek enerji, medikal

### Dengeli

- optimizasyon: genel performans
- reserve policy: orta
- module bias: su, enerji, yasam, kontrollu uretim

### Agresif Buyume

- optimizasyon: hizli genisleme
- reserve policy: dusuk-orta
- module bias: uretim, tarim, ek yasam alani

## 10. ScoreCard Sistemi

Frontend icin tek normalize skor kaynagi backend tarafinda uretilir.

| Skor | Kaynak |
| --- | --- |
| `site_suitability_score` | bolge analizi |
| `mission_fit_score` | mission brief + plan |
| `resource_access_score` | su + enerji + lojistik |
| `risk_index` | bolge + plan |
| `construction_difficulty` | slope + roughness + dependencies |
| `resilience_score` | yedeklilik + reserve policy |
| `autonomy_score` | robot_count + local production |
| `expansion_score` | area + phase layout |
| `sustainability_score` | water + food + energy closure |
| `survival_confidence` | genel agirlikli skor |

## 11. API Tasarimi

### `POST /planning-sessions`

Yeni session acar.

```json
{
  "selected_region_id": "elysium_planitia",
  "crew_size": 48,
  "mission_duration_months": 72,
  "risk_profile": "dengeli"
}
```

### `PATCH /planning-sessions/:id/quickstart`

Ana merkez secimlerini gunceller.

### `PATCH /planning-sessions/:id/mission-brief`

Detayli gorev brief'ini yazar.

### `POST /planning-sessions/:id/analyze-region`

RegionAnalysis uretir ve kaydeder.

### `POST /planning-sessions/:id/generate-plan`

CityPlan, CityPhase, ModuleRecommendation ve ScoreCard uretir.

### `POST /planning-sessions/:id/generate-scenarios`

3 senaryo olusturur.

### `POST /planning-sessions/:id/generate-report`

AIReport uretir.

### `GET /planning-sessions/:id`

Tum ekranlari besleyecek birlestirilmis session payload'i dondurur.

Ornek response:

```json
{
  "session": {
    "id": "2f61c8d2-2e2b-4f8d-bf46-6bc8eeb91355",
    "status": "plan_ready"
  },
  "quickstart": {
    "selected_region_id": "elysium_planitia",
    "crew_size": 48,
    "mission_duration_months": 72,
    "risk_profile": "dengeli"
  },
  "analysis": {
    "site_suitability_score": 84,
    "risk_index": 31
  },
  "plan": {
    "headline": "Dengeli plan / Elysium Planitia"
  },
  "scenarios": [
    { "scenario_name": "Korunakli" },
    { "scenario_name": "Dengeli" },
    { "scenario_name": "Agresif Buyume" }
  ]
}
```

## 12. Async Isler

MVP'de analiz ve plan senkron calisabilir. Ancak asagidaki isler async olmaya hazirdir:

- `generate-plan`
- `generate-scenarios`
- `generate-report`
- `exports`

### Job modeli

| Alan | Tip |
| --- | --- |
| `job_id` | UUID |
| `session_id` | UUID |
| `job_type` | text |
| `status` | enum |
| `progress` | int |
| `error_message` | text nullable |

Durumlar:

- `queued`
- `running`
- `completed`
- `failed`

## 13. Persistence Onerisi

### PostgreSQL

Kalici veriler:

- sessions
- mission_briefs
- regions
- region_analyses
- city_plans
- city_phases
- module_recommendations
- plan_scenarios
- score_cards
- ai_reports

### Redis

Gerektigi an:

- job progress
- gecici hesap cache'i
- report generation queue

### Object Storage

Ileride:

- pdf export
- json snapshot
- report artifact

## 14. Klasor Yapisi

```text
backend/
  app/
    main.py
    config.py
    db.py
    api/
      planning_sessions.py
      regions.py
      reports.py
    domains/
      sessions/
        models.py
        schemas.py
        service.py
        repository.py
      regions/
        models.py
        service.py
        repository.py
      analysis/
        engine.py
        rules.py
        schemas.py
      planning/
        engine.py
        module_catalog.py
        phase_builder.py
      scenarios/
        engine.py
      scoring/
        engine.py
      reports/
        prompt_builder.py
        service.py
    workers/
      jobs.py
    tests/
      test_sessions.py
      test_analysis.py
      test_planning.py
```

## 15. MVP Teknoloji Secimi

En pragmatik stack:

- `FastAPI`
- `SQLAlchemy`
- `Pydantic`
- `PostgreSQL`
- `Redis` opsiyonel

### Neden

- hizli API gelistirme
- typed schema yapisi
- frontend entegrasyonu kolay
- session tabanli CRUD icin uygun
- AI rapor pipeline'i rahat kurulur

## 16. Uygulama Sirasi

Bu backend su sirayla yapilmalidir:

1. `regions` sabit katalog
2. `planning_sessions` CRUD
3. `mission_brief` patch endpoint
4. `analysis engine`
5. `plan engine`
6. `scenario engine`
7. `report engine`

## 17. Sonuc

Backend'in cekirdegi `planning_session` modelidir. Tum frontend akisi bunun etrafinda doner. Bu model:

- tekrar eden veri girisini azaltir
- ekranlar arasi tutarlilik saglar
- plan ve rapor uretilmesini tek pipeline'a baglar
- MVP'den production'a gecisi kolaylastirir

Bu rapor, sonraki adimda backend klasorunu ve API iskeletini uygulamaya baslamak icin yeterli seviyede somutlastirilmistir.
