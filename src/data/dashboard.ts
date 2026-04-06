import type { DashboardMetric, ResourceMetric, TimelineItem } from "../types/mission";

export const ustMetrikler: DashboardMetric[] = [
  { etiket: "Saha uygunluğu", deger: "88.0", vurgu: "Arcadia dengesi", ton: "sicak" },
  { etiket: "Görev uyumu", deger: "%92", vurgu: "Dengeli plan", ton: "soguk" },
  { etiket: "ISRU hazırlığı", deger: "86", vurgu: "Su + oksijen hattı", ton: "dogal" },
  { etiket: "Kurulum ufku", deger: "36 ay", vurgu: "Faz II hedefi", ton: "sicak" }
];

export const gorevAkisi: TimelineItem[] = [
  {
    baslik: "Kutup iniş penceresini netleştir",
    detay: "Arcadia veya Planum Boreum için iniş güvenliği ile buz erişimi dengesini doğrula."
  },
  {
    baslik: "Yer altı çekirdeğini kilitle",
    detay: "Yaşam modüllerini yüzeyden geri çekip gömülü koruma derinliğini sabitle."
  },
  {
    baslik: "ISRU hattını erkene al",
    detay: "Su çıkarımı ve elektroliz zincirini Faz I sonuna kadar güvenceye al."
  }
];

export const operasyonKartlari = [
  { etiket: "Radyasyon koruması", deger: "Yer altı ile güçlü", ton: "success" as const },
  { etiket: "Su verimi", deger: "Kutup odaklı artış", ton: "info" as const },
  { etiket: "Yüzey lojistiği", deger: "Kontrollü zorluk", ton: "warning" as const },
  { etiket: "Sığınak hazırlığı", deger: "72 saat tampon", ton: "success" as const }
];

export const kaynakMetrikleri: ResourceMetric[] = [
  { etiket: "Güç rezervi", deger: 81, yorum: "Kompakt nükleer taban yükü ile güvenli." },
  { etiket: "Su geri kazanımı", deger: 78, yorum: "Kutup buzu ile Faz II hedefi güçlü." },
  { etiket: "Oksijen dengesi", deger: 84, yorum: "Elektroliz hattı ile destekleniyor." },
  { etiket: "Gıda özerkliği", deger: 57, yorum: "Tarım halkası büyütülmeli." }
];

export const isiHaritasi = [22, 34, 39, 48, 56, 44, 31, 46, 63];
