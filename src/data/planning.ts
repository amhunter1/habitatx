import type { PlanModule, ReportSection, Scenario, TimelineItem } from "../types/mission";

export const senaryolar: Scenario[] = [
  {
    ad: "Korunaklı Plan",
    optimizasyon: "Risk minimizasyonu",
    gorevUyumu: 88,
    risk: 24,
    otonomi: 66,
    maliyetDisiplini: 69,
    aciklama:
      "Yer altı sığınağı, yüksek su rezervi ve yedek yaşam desteği odaklı. Büyüme daha yavaş, ancak hayatta kalma marjı daha yüksek."
  },
  {
    ad: "Dengeli Plan",
    optimizasyon: "Genel denge",
    gorevUyumu: 92,
    risk: 31,
    otonomi: 76,
    maliyetDisiplini: 78,
    aciklama:
      "ISRU, enerji yedekliliği ve modüler büyümeyi aynı hizada tutar. İlk kalıcı koloni için ana öneri senaryosudur."
  },
  {
    ad: "Agresif Genişleme",
    optimizasyon: "Hızlı kapasite artışı",
    gorevUyumu: 81,
    risk: 46,
    otonomi: 84,
    maliyetDisiplini: 57,
    aciklama:
      "Erken üretim ve nüfus artışını zorlar. Su, bakım ve enerji tamponu daraldığı için yalnızca güçlü ISRU hattında anlamlıdır."
  }
];

export const moduller: PlanModule[] = [
  {
    ad: "Gömülü Yaşam Çekirdeği",
    kategori: "Habitat",
    faz: "Faz I",
    kapasite: "24 kişi",
    enerji: "Orta",
    aciklama: "Radyasyondan korunmuş yaşam alanı, medikal çekirdek ve acil durum sığınağı."
  },
  {
    ad: "ISRU Su ve Oksijen Tesisi",
    kategori: "Kaynak",
    faz: "Faz I-II",
    kapasite: "Günlük 16 ton işleme",
    enerji: "Yüksek",
    aciklama: "Buz çıkarımı, arıtma, elektroliz ve depolama zinciri."
  },
  {
    ad: "Regolit Kalkan Hattı",
    kategori: "Güvenlik",
    faz: "Faz I-II",
    kapasite: "Çekirdek çevresi koruma",
    enerji: "Düşük",
    aciklama: "Yer altı galerisi, yarı gömülü kabuk ve radyasyon tamponu için dış yapı omurgası."
  },
  {
    ad: "Robotik Kazı ve Bakım Hangarı",
    kategori: "Operasyon",
    faz: "Faz II",
    kapasite: "14 robot servis hattı",
    enerji: "Orta",
    aciklama: "Kazı, panel temizliği, contaların değişimi ve arıza toparlanması için operasyon merkezi."
  },
  {
    ad: "Tarım ve Su Geri Kazanım Halkası",
    kategori: "Gıda",
    faz: "Faz III",
    kapasite: "Toplam ihtiyacın %44'ü",
    enerji: "Orta",
    aciklama: "Biyorejeneratif üretim ile su döngüsünü kapalı hale getiren genişleme modülü."
  },
  {
    ad: "Yerel Üretim ve Yedek Parça Podu",
    kategori: "Sanayi",
    faz: "Faz III",
    kapasite: "Basit parça ve yapı elemanı",
    enerji: "Yüksek",
    aciklama: "ISRU destekli üretim hattı ile dış bağımlılığı düşüren yerel imalat omurgası."
  }
];

export const sehirFazlari: TimelineItem[] = [
  {
    baslik: "Faz I / Sığınak ve Yaşam",
    detay: "Gömülü yaşam çekirdeği, acil durum sığınağı, ilk enerji omurgası ve öncül su sondajı devreye alınır."
  },
  {
    baslik: "Faz II / ISRU Stabilizasyonu",
    detay: "Buz çıkarımı, oksijen üretimi, regolit kalkanı ve robotik bakım hattı sürekli çalışır hale gelir."
  },
  {
    baslik: "Faz III / Üretim ve Tarım",
    detay: "Tarım halkası, yerel üretim podu ve ek yaşam modülleri ile dış bağımlılık azaltılır."
  },
  {
    baslik: "Faz IV / Otonom Koloni",
    detay: "Karar destek sistemi, yerel üretim ve kaynak yönetimi birlikte optimize edilerek nüfus artışı desteklenir."
  }
];

export const raporBolumleri: ReportSection[] = [
  {
    baslik: "Yönetici Özeti",
    metin:
      "Ana karar, kutup ve yüksek enlem sahalarında su erişimi ile yer altı güvenliğini birleştirmektir. Yüzeyde hızlı kurulum yerine gömülü yaşam çekirdeği ve erken ISRU hattı temel strateji kabul edilmiştir."
  },
  {
    baslik: "Karar Gerekçesi",
    metin:
      "Arcadia Planitia tipi kutup koridorları, su çıkarımı, regolit kalkanı ve iniş güvenliğini aynı anda sunar. Planum Boreum daha yüksek su güveni sağlar; Deuteronilus Mensae ise doğal koruma potansiyeliyle teknik savunmada güçlü alternatif oluşturur."
  },
  {
    baslik: "İzlenmesi Gereken Riskler",
    metin:
      "Radyasyon, toz sonrası enerji kaybı, insan hatası, biyogüvenlik olayları ve kazı hattı arızaları ana risk alanlarıdır. Bu nedenle sığınak derinliği, yedek güç ve robotik bakım kapasitesi erken fazda sabitlenmelidir."
  },
  {
    baslik: "ISRU Önceliği",
    metin:
      "Koloninin sürdürülebilirliği için su, oksijen, regolit işleme ve CO2 tabanlı üretim ayrı başlıklar değil; tek bir yerinde kaynak ekonomisinin parçaları olarak ele alınmalıdır."
  }
];
