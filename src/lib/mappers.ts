import type {
  ClimateMetric,
  ForecastPoint,
  PlanModule,
  Region,
  ReportSection,
  ReportTopic,
  ResourceMetric,
  Scenario,
  TimelineItem
} from "../types/mission";
import type {
  BackendPlan,
  BackendRegion,
  BackendReport,
  BackendScenario,
  BackendScoreCard,
  BackendSessionEnvelope
} from "./api";

const EMPTY_HEATMAP = [18, 24, 28, 34, 40, 36, 26, 30, 44];

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function roundMetric(value: number | null | undefined, fallback: number): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }

  return Math.round(value);
}

function formatPercent(value: number): string {
  return `${clamp(value, 0, 100).toFixed(0)}%`;
}

function formatSigned(value: number): string {
  return `${value > 0 ? "+" : ""}${Math.round(value)}°C`;
}

function formatPascal(value: number): string {
  return `${Math.round(value)} Pa`;
}

function toRiskTone(score: number): string {
  if (score >= 85) return "Çok yüksek";
  if (score >= 70) return "Yüksek";
  if (score >= 55) return "Orta";
  return "Kontrollü";
}

function toDustLabel(score: number): string {
  if (score >= 72) return "Fırtına alarmı";
  if (score >= 56) return "Yüksek toz";
  if (score >= 38) return "İzleme modu";
  return "Düşük toz";
}

function estimateSuitability(region: BackendRegion): number {
  return clamp(
    0.24 * region.landing_safety +
    0.22 * region.ice_probability * 100 +
    0.18 * region.expansion_area +
    0.16 * region.construction_feasibility +
    0.1 * region.solar_efficiency -
    0.1 * region.radiation_estimate,
    32,
    93
  );
}

function estimateRisk(region: BackendRegion): number {
  return clamp(
    0.34 * region.radiation_estimate +
    0.28 * region.dust_risk +
    0.2 * region.crater_density +
    0.18 * region.roughness,
    14,
    91
  );
}

function estimateExpansion(region: BackendRegion): number {
  return clamp(
    0.4 * region.expansion_area +
    0.22 * region.construction_feasibility +
    0.18 * region.landing_safety +
    0.2 * region.ice_probability * 100,
    30,
    96
  );
}

function estimateLogistics(region: BackendRegion): number {
  return clamp(
    0.38 * region.landing_safety +
    0.22 * region.solar_efficiency +
    0.2 * region.construction_feasibility -
    0.1 * region.roughness -
    0.1 * region.crater_density,
    26,
    92
  );
}

function estimateIsru(region: BackendRegion, logistics: number): number {
  return roundMetric(
    clamp(
      0.42 * region.ice_probability * 100 +
      0.2 * region.construction_feasibility +
      0.18 * logistics +
      0.1 * region.solar_efficiency +
      0.1 * (100 - region.dust_risk),
      24,
      96
    ),
    60
  );
}

function deriveClimate(region: BackendRegion, scoreCard: BackendScoreCard | null) {
  const survivalConfidence = roundMetric(scoreCard?.survival_confidence, 66);
  const resilience = roundMetric(scoreCard?.resilience_score, 50);
  const autonomy = roundMetric(scoreCard?.autonomy_score, 50);
  const sustainability = roundMetric(scoreCard?.sustainability_score, 50);
  const missionFit = roundMetric(scoreCard?.mission_fit_score, 50);

  // Brief-dependent modifiers — scaled to produce visible value shifts
  const resilienceShift = (resilience - 50) * 0.42;
  const autonomyShift = (autonomy - 50) * 0.36;
  const sustainabilityShift = (sustainability - 50) * 0.38;
  const missionFitShift = (missionFit - 50) * 0.3;

  const latitudePenalty = (0.5 - region.map_position_y) * 40;
  const meanTemp =
    -63 - (region.thermal_range - 55) * 0.24 + (region.solar_efficiency - 75) * 0.12
    - latitudePenalty + resilienceShift + missionFitShift * 0.3;
  const pressure = clamp(
    720 + (region.landing_safety - 75) * 3 - (region.map_position_y - 0.5) * 120
    + Math.round(missionFitShift * 2.5 + resilienceShift * 1.2),
    610,
    860
  );
  const pressureSwing = Math.max(12, Math.round(pressure * 0.09 - resilience * 0.22));
  const dustProbability = clamp(
    region.dust_risk * 0.92 + region.crater_density * 0.18 - region.solar_efficiency * 0.1
    - autonomyShift * 1.4 - sustainabilityShift * 0.8,
    12,
    94
  );
  const radiationBuffer = clamp(
    100 - region.radiation_estimate + resilienceShift * 1.6 + autonomyShift * 0.5,
    20,
    92
  );
  const solarYield = clamp(
    region.solar_efficiency - region.dust_risk * 0.16 + sustainabilityShift * 1.2 + missionFitShift * 0.4,
    26,
    88
  );
  const safeWindow = Math.max(8, Math.round(survivalConfidence / 5) + Math.round(resilience / 12));

  return {
    meanTemp,
    pressure,
    pressureSwing,
    dustProbability,
    radiationBuffer,
    solarYield,
    safeWindow,
    resilience,
    autonomy,
    sustainability
  };
}

function buildEnvironmentSummary(
  region: BackendRegion,
  scoreCard: BackendScoreCard | null
): ClimateMetric[] {
  const climate = deriveClimate(region, scoreCard);

  return [
    {
      etiket: "Yüzey sıcaklığı",
      deger: formatSigned(climate.meanTemp),
      yardimci:
        climate.meanTemp >= -55
          ? `Dayanıklılık ${climate.resilience}/100 — termal yönetim güçlü.`
          : climate.meanTemp >= -70
            ? `Dayanıklılık ${climate.resilience}/100 — standart termal koruma yeterli.`
            : `Dayanıklılık ${climate.resilience}/100 — ekstra termal izolasyon gerekli.`
    },
    {
      etiket: "Basınç",
      deger: formatPascal(climate.pressure),
      yardimci: `Günlük salınım ±${climate.pressureSwing} Pa. Otonomi ${climate.autonomy}/100.`
    },
    {
      etiket: "Toz durumu",
      deger: toDustLabel(climate.dustProbability),
      yardimci:
        climate.dustProbability >= 60
          ? `${Math.round(climate.dustProbability)}% baskı — sürdürülebilirlik ${climate.sustainability}/100, panel bakımı kritik.`
          : `${Math.round(climate.dustProbability)}% baskı — sürdürülebilirlik ${climate.sustainability}/100, kontrollü seviyede.`
    }
  ];
}

function buildEnvironmentDetails(
  region: BackendRegion,
  scoreCard: BackendScoreCard | null
): ClimateMetric[] {
  const climate = deriveClimate(region, scoreCard);

  return [
    {
      etiket: "Termal salınım",
      deger: `${Math.round(region.thermal_range)}°C`,
      yardimci:
        climate.resilience >= 65
          ? `Dayanıklılık ${climate.resilience}/100 — habitat kabuğu kalınlığı optimize edildi.`
          : `Dayanıklılık ${climate.resilience}/100 — ekstra izolasyon katmanı planlanmalı.`
    },
    {
      etiket: "Radyasyon tamponu",
      deger: `${Math.round(climate.radiationBuffer)}/100`,
      yardimci:
        climate.radiationBuffer >= 65
          ? `Otonomi ${climate.autonomy}/100 — düşük maruziyet, regolit kalkanı efektif.`
          : `Otonomi ${climate.autonomy}/100 — kalkan kapasitesi artırılmalı.`
    },
    {
      etiket: "Solar verim",
      deger: `${Math.round(climate.solarYield)}%`,
      yardimci:
        climate.solarYield >= 65
          ? `Sürdürülebilirlik ${climate.sustainability}/100 — enerji hattı güçlü.`
          : `Sürdürülebilirlik ${climate.sustainability}/100 — nükleer yedekleme önerilir.`
    },
    {
      etiket: "Güvenli pencere",
      deger: `${climate.safeWindow} ay`,
      yardimci: `Dayanıklılık ${climate.resilience}/100, otonomi ${climate.autonomy}/100 baz alındı.`
    }
  ];
}

function buildForecast(region: BackendRegion, scoreCard: BackendScoreCard | null): ForecastPoint[] {
  const climate = deriveClimate(region, scoreCard);
  const baselineTemp = climate.meanTemp;
  const baselinePressure = climate.pressure;

  return [1, 2, 3].map((offset) => {
    const tempShift = (region.solar_efficiency - region.dust_risk) * 0.05 - offset * 1.8;
    const pressureShift = (region.landing_safety - 70) * 0.6 - offset * 4;
    const dustShift = offset * 4 + region.crater_density * 0.08;
    const dustScore = clamp(climate.dustProbability + dustShift, 12, 96);

    return {
      sol: `Sol +${offset}`,
      sicaklik: formatSigned(baselineTemp + tempShift),
      basinc: formatPascal(baselinePressure + pressureShift),
      toz: toDustLabel(dustScore),
      durum:
        dustScore >= 70
          ? "Dış operasyonu kısalt, bakım dronlarını iç hatta kaydır."
          : dustScore >= 48
            ? "Enerji tamponunu yükselt, güneş hattını temizleme modunda tut."
            : "Standart EVA ve yüzey taşıma penceresi açık."
    };
  });
}

function buildRegionLayers(region: BackendRegion): string[] {
  const layers = [
    region.ice_probability >= 0.82 ? "Kutup buz damarı" : "Yüzey altı buz cebi",
    region.radiation_estimate <= 45 ? "Yer altı koruma zonu" : "Ek radyasyon kalkanı",
    region.expansion_area >= 70 ? "Tünel genişleme cepleri" : "Sınırlı genişleme cebi"
  ];

  if (region.solar_efficiency >= 60) {
    layers.push("Solar destek omurgası");
  }

  return layers;
}

function buildHabitatMode(region: BackendRegion): { mode: string; rationale: string; cave: string } {
  if (region.id === "planum_boreum") {
    return {
      mode: "Yer altı veya yarı gömülü kutup habitatı",
      rationale:
        "Kutup buzu erişimi çok güçlü olsa da yüzeyde radyasyon, termal sertlik ve düşük enerji penceresi nedeniyle ana yaşam hacmi yer altında korunmalıdır.",
      cave:
        "NASA yüzey altı boşluk olasılıklarını destekleyen genel Mars verileri sunsa da bu sahada doğrulanmış doğal mağara yerine açılmış siper, buz altı galeri ve regolit tüneli daha gerçekçi görülüyor."
    };
  }

  if (region.id === "deuteronilus_mensae") {
    return {
      mode: "Yarı gömülü habitat + doğal korunak araştırması",
      rationale:
        "Bölge buz bakımından zengin ama yüzey pürüzlülüğü daha yüksek. Ana yaşam modülleri gömülü hat üzerinde olmalı; servis ve enerji omurgası dışta kalabilir.",
      cave:
        "Yamaç oyukları ve örtülü boşluk cepleri araştırmaya uygun. Doğal korunak potansiyeli var ancak garanti mağara varsayımıyla plan yapmak riskli olur."
    };
  }

  return {
    mode: "Yer altı hibrit habitat",
    rationale:
      "Arcadia hattı iniş ve lojistik açısından daha dengeli. Yüzeyde yalnız enerji ve servis modülleri tutulmalı, yaşam çekirdeği regolit koruması altında kurulmalıdır.",
    cave:
      "Doğal lav tüpü kanıtı sınırlı. En güvenli yaklaşım, yapay regolit tüneli ve gömülü modüler koridor kurmaktır."
  };
}

function buildResourceFocus(region: BackendRegion): string[] {
  if (region.id === "planum_boreum") {
    return [
      "Su buzu çıkarımı",
      "Regolit ile radyasyon kalkanı",
      "CO2’den oksijen üretimi",
      "Kutup lojistiği için termal depolama"
    ];
  }

  if (region.id === "deuteronilus_mensae") {
    return [
      "Yüzey altı buz erişimi",
      "Regolit yapı ve tünel destekleme",
      "CO2’den oksijen ve yakıt öncüleri",
      "Bakım robotiği ile eğimli saha yönetimi"
    ];
  }

  return [
    "Erişilebilir yüzey altı buz",
    "Regolit kalkanlama",
    "CO2’den oksijen ve metan zinciri",
    "Geri kazanım destekli su ekonomisi"
  ];
}

function buildAnalysisRows(
  region: BackendRegion,
  suitability: number,
  risk: number,
  expansion: number,
  logistics: number,
  summary: string,
  scoreCard: BackendScoreCard | null,
  normalizedIce?: number
): Region["analizSatirlari"] {
  const missionFit = roundMetric(scoreCard?.mission_fit_score, 50);
  const autonomy = roundMetric(scoreCard?.autonomy_score, 50);
  const resilience = roundMetric(scoreCard?.resilience_score, 50);

  return [
    {
      metrik: "Saha uygunluğu",
      deger: `${roundMetric(suitability, 0)}`,
      yorum:
        suitability >= 75
          ? `Görev uyumu güçlü (${missionFit}/100). ${summary}`
          : suitability >= 55
            ? `Orta uygunluk (${missionFit}/100). Parametre iyileştirmesi ile artırılabilir.`
            : `Düşük uygunluk (${missionFit}/100). Brief parametreleri gözden geçirilmeli.`
    },
    {
      metrik: "Risk indeksi",
      deger: `${roundMetric(risk, 0)}`,
      yorum:
        risk >= 65
          ? `Yüksek risk bandı. Dayanıklılık skoru ${resilience}/100 — kalkan ve yedeklilik erken fazda planlanmalı.`
          : risk >= 40
            ? `Orta risk. Dayanıklılık ${resilience}/100 ile yönetilebilir seviyede.`
            : `Kontrollü risk. Dayanıklılık ${resilience}/100 — operasyonel tampon güçlü.`
    },
    {
      metrik: "Genişleme skoru",
      deger: `${roundMetric(expansion, 0)}`,
      yorum:
        expansion >= 70
          ? `Faz II-III büyümesi için uygun. Otonomi seviyesi ${autonomy}/100.`
          : `Genişleme sınırlı. Otonomi ${autonomy}/100 — yoğun planlama gerekiyor.`
    },
    {
      metrik: "Lojistik skoru",
      deger: `${roundMetric(logistics, 0)}`,
      yorum:
        logistics >= 65
          ? `Kurulum akışı güçlü. Dayanıklılık ${resilience}/100, otonomi ${autonomy}/100.`
          : `Lojistik optimize edilmeli. Dayanıklılık ${resilience}/100.`
    },
    {
      metrik: "Buz erişimi",
      deger: `${roundMetric(normalizedIce ?? region.ice_probability * 100, 0)}`,
      yorum:
        (normalizedIce ?? region.ice_probability * 100) >= 70
          ? "Su/yakıt zinciri için güçlü yerel girdi. ISRU hattı erken fazda devreye girebilir."
          : "Buz erişimi orta — geri kazanım ve ikmal dengesine dikkat."
    }
  ];
}

function buildStrengths(
  region: BackendRegion,
  scoreCard: BackendScoreCard | null,
  suitability: number,
  logistics: number
): string[] {
  const resilience = roundMetric(scoreCard?.resilience_score, 50);
  const autonomy = roundMetric(scoreCard?.autonomy_score, 50);
  const sustainability = roundMetric(scoreCard?.sustainability_score, 50);

  return [
    suitability >= 70
      ? `Saha uygunluğu ${Math.round(suitability)}/100 ile güçlü. Görev brief'i ile uyumlu profil.`
      : `Saha uygunluğu ${Math.round(suitability)}/100. Brief optimizasyonu ile artırılabilir.`,
    logistics >= 65
      ? `Lojistik skor ${Math.round(logistics)}/100. Dayanıklılık ${resilience}/100 — kurulum akışı güvenli.`
      : `Lojistik ${Math.round(logistics)}/100. Dayanıklılık ${resilience}/100 — iniş koridoru optimize edilmeli.`,
    autonomy >= 65
      ? `Otonomi seviyesi ${autonomy}/100. Yerel üretim kapasitesi güçlü.`
      : `Otonomi ${autonomy}/100. Düşük otonomi ikmal bağımlılığını artırır.`,
    sustainability >= 60
      ? `Sürdürülebilirlik skoru ${sustainability}/100 — uzun vadeli operasyon için uygun.`
      : `Sürdürülebilirlik ${sustainability}/100 — kaynak yönetimi iyileştirilmeli.`
  ];
}

function buildRedFlags(
  region: BackendRegion,
  scoreCard: BackendScoreCard | null,
  risk: number
): string[] {
  const flags: string[] = [];
  const resilience = roundMetric(scoreCard?.resilience_score, 50);
  const autonomy = roundMetric(scoreCard?.autonomy_score, 50);

  if (risk >= 60) {
    flags.push(`Risk indeksi ${Math.round(risk)}/100 ile yüksek. Dayanıklılık ${resilience}/100 — erken faz kalkan ve yedeklilik planları kritik.`);
  }

  if (region.dust_risk >= 65) {
    flags.push(`Toz riski yüksek (${Math.round(region.dust_risk)}/100). Panel bakımı ve filtreleme hatları güçlendirilmeli.`);
  }

  if (region.radiation_estimate >= 60) {
    flags.push(`Radyasyon ${Math.round(region.radiation_estimate)}/100. Regolit koruması Faz I içinde planlanmalı.`);
  }

  if (autonomy < 55) {
    flags.push(`Otonomi seviyesi ${autonomy}/100 ile düşük. İkmal bağımlılığı yüksek kalacak — ISRU ve robotik önceliklendirilmeli.`);
  }

  if (resilience < 55) {
    flags.push(`Dayanıklılık ${resilience}/100. Enerji ve bakım yedekliliği artırılmalı.`);
  }

  if (region.roughness >= 45 || region.crater_density >= 35) {
    flags.push(`Yüzey pürüzlülüğü yüksek. Ağır ekipman rotaları önceden stabilize edilmeli.`);
  }

  return flags.length ? flags : [`Risk indeksi ${Math.round(risk)}/100, dayanıklılık ${resilience}/100 — kritik tekil alarm yok; operasyonel tamponlar korunmalı.`];
}

function buildResourcePressure(
  scoreCard: BackendScoreCard | null,
  risk: number,
  normalizedIce: number,
  recommendations: string[]
): Region["kaynakBaski"] {
  const resilience = roundMetric(scoreCard?.resilience_score, 68);
  const sustainability = roundMetric(scoreCard?.sustainability_score, 62);
  const resourceAccess = roundMetric(scoreCard?.resource_access_score, 60);

  return [
    {
      sistem: "Güç",
      normal: `+${Math.round(resourceAccess / 7)}%`,
      firtina: `-${Math.round(risk / 7)}%`,
      aksiyon: recommendations[0] ?? "Enerji tamponu ve mikro-grid yedekliliğini koru."
    },
    {
      sistem: "Su",
      normal: `+${Math.round(normalizedIce / 8)}%`,
      firtina: `+${Math.round(sustainability / 14)}%`,
      aksiyon: recommendations[1] ?? "ISRU çıkarma hattını geri kazanım ile dengele."
    },
    {
      sistem: "Bakım",
      normal: `-${Math.round(risk / 9)}%`,
      firtina: `-${Math.round((100 - resilience) / 6)}%`,
      aksiyon: recommendations[2] ?? "Robotik servis ve yedek parçayı Faz II öncesi büyüt."
    }
  ];
}

function buildDefaultPhases(regionName: string): Region["fazlar"] {
  return [
    {
      faz: "Faz I",
      odak: `${regionName} için iniş, enerji ve çekirdek habitat kurulumu`,
      teslimler: ["İniş koridoru", "Enerji omurgası", "Çekirdek habitat"]
    },
    {
      faz: "Faz II",
      odak: "ISRU, su geri kazanım ve servis modüllerinin dengelenmesi",
      teslimler: ["Su hattı", "Bakım robotiği", "Yedek depolama"]
    },
    {
      faz: "Faz III",
      odak: "Yerleşim büyümesi ve operasyonel otonominin artırılması",
      teslimler: ["Ek habitatlar", "Tarım kapasitesi", "Yedek güç adaları"]
    }
  ];
}

function buildRegionSummary(region: BackendRegion, suitability: number, risk: number): string {
  return `${region.display_name} sahası ${Math.round(suitability)} uygunluk ve ${Math.round(
    risk
  )} risk bandı ile ${region.sector.toLowerCase()} içinde buz erişimi odaklı dengeli bir kurulum profili sunuyor.`;
}

function buildRegionFromSource(
  region: BackendRegion,
  analysis: BackendSessionEnvelope["analysis"],
  scoreCard: BackendScoreCard | null,
  plan: BackendPlan | null
): Region {
  const baseSuitability = analysis?.site_suitability_score ?? estimateSuitability(region);
  const baseRisk = analysis?.risk_index ?? estimateRisk(region);
  const baseExpansion = analysis?.expansion_score ?? estimateExpansion(region);
  const baseLogistics = analysis?.logistics_score ?? estimateLogistics(region);

  // scoreCard comes from generatePlan and reflects mission brief parameters.
  // Blend scoreCard influence into region scores so they react to brief changes.
  const missionFit = scoreCard?.mission_fit_score ?? null;
  const scRisk = scoreCard?.risk_index ?? null;
  const scExpansion = scoreCard?.expansion_score ?? null;
  const scResilience = scoreCard?.resilience_score ?? null;

  const suitability =
    missionFit !== null
      ? clamp(Math.round(baseSuitability * 0.6 + missionFit * 0.4), 20, 96)
      : baseSuitability;
  const risk =
    scRisk !== null
      ? clamp(Math.round(baseRisk * 0.6 + scRisk * 0.4), 10, 94)
      : baseRisk;
  const expansion =
    scExpansion !== null
      ? clamp(Math.round(baseExpansion * 0.6 + scExpansion * 0.4), 20, 96)
      : baseExpansion;
  const logistics =
    scResilience !== null
      ? clamp(Math.round(baseLogistics * 0.6 + scResilience * 0.4), 20, 96)
      : baseLogistics;
  const normalizedIce = analysis?.derived_metrics?.normalized_ice ?? region.ice_probability * 100;
  const isruScore = estimateIsru(region, logistics);
  const summary = analysis?.analysis_summary ?? buildRegionSummary(region, suitability, risk);
  const strengths = buildStrengths(region, scoreCard, suitability, logistics);
  const redFlags = buildRedFlags(region, scoreCard, risk);
  const habitat = buildHabitatMode(region);

  return {
    id: region.id,
    ad: region.display_name,
    sektor: region.sector,
    tanim: region.summary,
    mapPositionX: region.map_position_x,
    mapPositionY: region.map_position_y,
    ozet: summary,
    uygunlukSkoru: roundMetric(suitability, 0),
    riskIndeksi: roundMetric(risk, 0),
    genislemeSkoru: roundMetric(expansion, 0),
    lojistikSkoru: roundMetric(logistics, 0),
    isruSkoru: isruScore,
    ortalamaEğim: `${region.slope.toFixed(1)} derece`,
    buzOlasiligi: formatPercent(region.ice_probability * 100),
    tozRiski: toRiskTone(region.dust_risk),
    sicaklikAraligi: `${-Math.round(region.thermal_range + 36)} / ${formatSigned(-12).replace("+", "")}`,
    inisGuvenligi: toRiskTone(region.landing_safety),
    kurulumPenceresi: `${Math.max(
      8,
      Math.round((scoreCard?.survival_confidence ?? 66) / 4)
    )} ay güvenli pencere`,
    habitatModu: habitat.mode,
    habitatGerekcesi: habitat.rationale,
    magaraPotansiyeli: habitat.cave,
    kaynakOdaklari: buildResourceFocus(region),
    cevreOzeti: buildEnvironmentSummary(region, scoreCard),
    cevreDetaylari: buildEnvironmentDetails(region, scoreCard),
    havaTahmini: buildForecast(region, scoreCard),
    nasaReferansNotu:
      "NASA Mars Facts, Water on Mars ve cave skylight bulguları birlikte değerlendirildi. Kutup su buzu erişimi yüksek, ancak doğal mağara varlığı seçilen her sahada garanti değildir; bu nedenle varsayılan çözüm yer altı veya yarı gömülü habitat olarak tutuldu.",
    anaNotlar: strengths,
    kirmiziBayraklar: redFlags,
    katmanlar: buildRegionLayers(region),
    analizSatirlari: buildAnalysisRows(
      region,
      suitability,
      risk,
      expansion,
      logistics,
      summary,
      scoreCard,
      normalizedIce
    ),
    kaynakBaski: buildResourcePressure(
      scoreCard,
      roundMetric(risk, 0),
      roundMetric(normalizedIce, 0),
      plan?.top_recommendations ?? []
    ),
    fazlar: plan?.phases?.length
      ? plan.phases.map((phase) => ({
        faz: phase.phase_name,
        odak: phase.objective,
        teslimler: phase.deliverables
      }))
      : buildDefaultPhases(region.display_name)
  };
}

export function toApiRiskProfile(value: string): string {
  const normalized = value.toLocaleLowerCase("tr-TR");
  if (normalized.includes("korunak")) return "korunakli";
  if (normalized.includes("agresif")) return "agresif_buyume";
  return "dengeli";
}

export function toUiRiskProfile(value: string): string {
  if (value === "korunakli") return "Korunaklı";
  if (value === "agresif_buyume") return "Agresif büyüme";
  return "Dengeli";
}

export function mapEnvelopeToRegions(
  envelope: BackendSessionEnvelope,
  backendRegions: BackendRegion[]
): Region[] {
  const selectedRegionId = envelope.quickstart.selected_region_id;
  const sourceRegions =
    backendRegions.length > 0 ? backendRegions : envelope.region ? [envelope.region] : [];

  return sourceRegions.map((region) =>
    buildRegionFromSource(
      region,
      region.id === selectedRegionId ? envelope.analysis : null,
      region.id === selectedRegionId ? envelope.score_card : null,
      region.id === selectedRegionId ? envelope.plan : null
    )
  );
}

export function mapScenarioName(name: string): Scenario["ad"] {
  if (name === "Korunakli") return "Korunaklı Plan";
  if (name === "Agresif Buyume") return "Agresif Genişleme";
  return "Dengeli Plan";
}

export function buildScenarioFallbacks(scoreCard: BackendScoreCard | null): Scenario[] {
  const missionFit = roundMetric(scoreCard?.mission_fit_score, 72);
  const risk = roundMetric(scoreCard?.risk_index, 38);
  const autonomy = roundMetric(scoreCard?.autonomy_score, 66);
  const sustainability = roundMetric(scoreCard?.sustainability_score, 64);

  return [
    {
      ad: "Korunaklı Plan",
      optimizasyon: "Hayatta kalma ve yedeklilik",
      gorevUyumu: clamp(missionFit - 4, 45, 95),
      risk: clamp(risk - 8, 10, 90),
      otonomi: clamp(autonomy - 6, 25, 95),
      maliyetDisiplini: clamp(sustainability + 8, 20, 98),
      aciklama: "Koruma katmanları ve rezerv kapasiteyi öne çıkarır."
    },
    {
      ad: "Dengeli Plan",
      optimizasyon: "Operasyon, kaynak ve büyüme dengesi",
      gorevUyumu: missionFit,
      risk,
      otonomi: autonomy,
      maliyetDisiplini: sustainability,
      aciklama: "Kurulum hızı ile operasyonel güven arasında dengeli bir profil sunar."
    },
    {
      ad: "Agresif Genişleme",
      optimizasyon: "Erken kapasite artışı ve yüksek otonomi",
      gorevUyumu: clamp(missionFit + 5, 40, 98),
      risk: clamp(risk + 10, 10, 96),
      otonomi: clamp(autonomy + 9, 20, 99),
      maliyetDisiplini: clamp(sustainability - 10, 12, 95),
      aciklama: "Büyüme hızını artırır; risk ve kaynak baskısını daha erken öne çeker."
    }
  ];
}

export function mapBackendScenarios(
  scenarios: BackendScenario[],
  scoreCard: BackendScoreCard | null
): Scenario[] {
  if (!scenarios.length) {
    return buildScenarioFallbacks(scoreCard);
  }

  return scenarios.map((scenario) => ({
    ad: mapScenarioName(scenario.scenario_name),
    optimizasyon: scenario.optimization_target,
    gorevUyumu: Math.round(scenario.mission_fit_score),
    risk: Math.round(scenario.risk_index),
    otonomi: Math.round(scenario.autonomy_score),
    maliyetDisiplini: Math.round(scenario.cost_discipline_score),
    aciklama: scenario.summary
  }));
}

export function mapPlanModules(plan: BackendPlan | null): PlanModule[] {
  return (
    plan?.modules.map((module) => ({
      ad: module.module_name,
      kategori: module.category,
      faz: module.phase_fit,
      kapasite: module.capacity_note,
      enerji: module.energy_load,
      aciklama: module.reason
    })) ?? []
  );
}

export function mapPlanPhases(plan: BackendPlan | null): TimelineItem[] {
  return (
    plan?.phases.map((phase) => ({
      baslik: `${phase.phase_name} / Kurulum`,
      detay: phase.objective
    })) ?? []
  );
}

export function mapReportSections(report: BackendReport | null): ReportSection[] {
  if (!report) {
    return [];
  }

  const payloadSections = report.report_payload?.sections;
  if (!Array.isArray(payloadSections)) {
    return [
      {
        baslik: "Teknik özet",
        metin: report.technical_summary
      }
    ];
  }

  return payloadSections.flatMap((section, index) => {
    if (
      section &&
      typeof section === "object" &&
      "title" in section &&
      "content" in section &&
      typeof section.title === "string" &&
      typeof section.content === "string"
    ) {
      return [
        {
          baslik: section.title || `Bölüm ${index + 1}`,
          metin: section.content
        }
      ];
    }

    return [];
  });
}

export function mapReportActions(report: BackendReport | null): TimelineItem[] {
  return (
    report?.next_actions.map((action, index) => ({
      baslik: `Aksiyon ${index + 1}`,
      detay: action
    })) ?? []
  );
}

export function mapReportTopics(report: BackendReport | null): ReportTopic[] {
  const payloadTopics = report?.report_payload?.topic_briefs;
  if (!Array.isArray(payloadTopics)) {
    return [];
  }

  return payloadTopics.flatMap((topic) => {
    if (
      topic &&
      typeof topic === "object" &&
      "title" in topic &&
      "severity" in topic &&
      "problem" in topic &&
      "solution" in topic &&
      typeof topic.title === "string" &&
      typeof topic.severity === "string" &&
      typeof topic.problem === "string" &&
      typeof topic.solution === "string"
    ) {
      return [
        {
          baslik: topic.title,
          seviye: topic.severity,
          sorun: topic.problem,
          cozum: topic.solution
        }
      ];
    }

    return [];
  });
}

export function mapResourceMetrics(scoreCard: BackendScoreCard | null): ResourceMetric[] {
  if (!scoreCard) {
    return [];
  }

  return [
    {
      etiket: "Güç rezervi",
      deger: Math.round(scoreCard.resilience_score),
      yorum: "Yedeklilik ve enerji tampon kapasitesi"
    },
    {
      etiket: "Su erişimi",
      deger: Math.round(scoreCard.resource_access_score),
      yorum: "Su, lojistik ve enerji akış kalitesi"
    },
    {
      etiket: "Otonomi",
      deger: Math.round(scoreCard.autonomy_score),
      yorum: "Yerel üretim ve robotik süreklilik seviyesi"
    },
    {
      etiket: "Survival confidence",
      deger: Math.round(scoreCard.survival_confidence),
      yorum: "Genel operasyon güven bandı"
    }
  ];
}

export function mapHeatmap(scoreCard: BackendScoreCard | null): number[] {
  if (!scoreCard) {
    return EMPTY_HEATMAP;
  }

  const base = Math.round(scoreCard.risk_index);
  return [
    base - 10,
    base - 4,
    base + 2,
    base + 8,
    base + 12,
    base + 5,
    base - 3,
    base + 6,
    base + 14
  ].map((value) => Math.max(12, Math.min(88, value)));
}
