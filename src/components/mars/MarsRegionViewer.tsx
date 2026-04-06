import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type { Region } from "../../types/mission";
import { MarsViewer } from "./MarsViewer";

type LayerInsight = {
  baslik: string;
  ozet: string;
  metrikEtiketi: string;
  metrikDegeri: string;
  aksiyon: string;
};

function slugifyLayerName(value: string): string {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/ /g, "-")
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
}

function buildLayerInsight(region: Region, activeLayer: string): LayerInsight {
  const normalized = slugifyLayerName(activeLayer);

  if (normalized.includes("buz")) {
    return {
      baslik: `${activeLayer} / Su erişimi`,
      ozet: "Bu katman yerel su zincirinin ne kadar erken kurulabileceğini ve ISRU temposunu gösterir.",
      metrikEtiketi: "Buz olasılığı",
      metrikDegeri: region.buzOlasiligi,
      aksiyon: region.anaNotlar[0] ?? "Su çıkarma sondajını Faz I içine çek."
    };
  }

  if (normalized.includes("koruma")) {
    return {
      baslik: `${activeLayer} / Radyasyon tamponu`,
      ozet: "Korunaklı alanlar habitat kabuğu, regolit örtüsü ve acil durum cepleri için önceliklidir.",
      metrikEtiketi: "Risk indeksi",
      metrikDegeri: `${region.riskIndeksi}`,
      aksiyon: region.habitatGerekcesi
    };
  }

  if (normalized.includes("genisleme")) {
    return {
      baslik: `${activeLayer} / Faz III potansiyeli`,
      ozet: "Genişleme cepleri kutup sahasında yeni tünel hatlarının ve servis omurgasının nereye kayacağını gösterir.",
      metrikEtiketi: "Genişleme skoru",
      metrikDegeri: `${region.genislemeSkoru}`,
      aksiyon: region.fazlar[2]?.odak ?? "Faz II sonrasında büyüme adalarını bu banda kaydır."
    };
  }

  if (normalized.includes("solar")) {
    return {
      baslik: `${activeLayer} / Enerji omurgası`,
      ozet: "Solar tarla omurgası kutup kuşağında destek enerji hattını, batarya tamponunu ve servis aksını temsil eder.",
      metrikEtiketi: "Lojistik skoru",
      metrikDegeri: `${region.lojistikSkoru}`,
      aksiyon: region.kaynakBaski[0]?.aksiyon ?? "Mikro-grid halkasını bu hat boyunca kur."
    };
  }

  return {
    baslik: `${activeLayer} / Yüzey okuması`,
    ozet: "Seçili katman bu bölge için operasyon planına en çok etki eden morfolojik bandı öne çıkarır.",
    metrikEtiketi: "ISRU hazırlığı",
    metrikDegeri: `${region.isruSkoru}`,
    aksiyon: region.kaynakOdaklari[0] ?? "Bu bandı saha etüdü ile doğrula."
  };
}

export function MarsRegionViewer({
  regions,
  seciliBolge,
  onSelect,
  baslik = "Mars bölge görünümü",
  aciklama = "Aday bölgeler gezegen yüzeyi üzerinde doğrudan görülebilir ve seçilebilir."
}: {
  regions: Region[];
  seciliBolge: Region;
  onSelect: (id: string) => void;
  baslik?: string;
  aciklama?: string;
}) {
  const [aktifKatman, setAktifKatman] = useState<string>("");

  useEffect(() => {
    if (!seciliBolge.katmanlar.length) {
      setAktifKatman("");
      return;
    }

    setAktifKatman((current) =>
      current && seciliBolge.katmanlar.includes(current) ? current : seciliBolge.katmanlar[0]
    );
  }, [seciliBolge]);

  const aktifKatmanSinifi = useMemo(
    () => (aktifKatman ? `layer-${slugifyLayerName(aktifKatman)}` : ""),
    [aktifKatman]
  );
  const aktifKatmanBilgisi = useMemo(
    () => buildLayerInsight(seciliBolge, aktifKatman || seciliBolge.katmanlar[0] || "Katman"),
    [aktifKatman, seciliBolge]
  );

  return (
    <div className="mars-viewer">
      <div className="mars-viewer-header">
        <div>
          <p className="eyebrow">3D görünüm</p>
          <h4>{baslik}</h4>
        </div>
        <p>{aciklama}</p>
      </div>

      <div
        className={`mars-globe mars-model-shell ${aktifKatmanSinifi}`.trim()}
        style={{ "--mars-glow-opacity": aktifKatman ? 1 : 0.72 } as CSSProperties}
      >
        <MarsViewer regions={regions} selectedRegionId={seciliBolge.id} onSelect={onSelect} />
        <div className="mars-overlay-glow" />
        <div className="mars-active-layer-indicator">
          <strong>{aktifKatman || "Katman seç"}</strong>
          <span>{seciliBolge.ad} için aktif okuma katmanı</span>
        </div>
      </div>

      <div className="layer-row" style={{ marginTop: '1.5rem' }}>
        {seciliBolge.katmanlar.map((katman) => (
          <button
            key={katman}
            className={`layer-pill ${katman === aktifKatman ? "active" : ""}`}
            onClick={() => setAktifKatman(katman)}
            type="button"
          >
            {katman}
          </button>
        ))}
      </div>

      <div className="mars-layer-insight-card">
        <div>
          <p className="eyebrow">Aktif katman</p>
          <h5>{aktifKatmanBilgisi.baslik}</h5>
          <p>{aktifKatmanBilgisi.ozet}</p>
        </div>
        <div className="mars-layer-insight-metric">
          <span>{aktifKatmanBilgisi.metrikEtiketi}</span>
          <strong>{aktifKatmanBilgisi.metrikDegeri}</strong>
        </div>
        <div className="mars-layer-insight-action">
          <span>Operasyon aksiyonu</span>
          <strong>{aktifKatmanBilgisi.aksiyon}</strong>
        </div>
      </div>
    </div>
  );
}
