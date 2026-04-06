export type ViewId =
  | "ana-merkez"
  | "gorev-paneli"
  | "bolge-secimi"
  | "bolge-analizi"
  | "gorev-konfigurasyonu"
  | "sehir-plani"
  | "senaryo-karsilastirma"
  | "risk-kaynak"
  | "ai-raporu"
  | "kaynaklar";

export type NavItem = {
  id: ViewId;
  baslik: string;
  kategori: string;
};

export type DashboardMetric = {
  etiket: string;
  deger: string;
  vurgu: string;
  ton?: "sicak" | "soguk" | "dogal";
};

export type ClimateMetric = {
  etiket: string;
  deger: string;
  yardimci: string;
};

export type ForecastPoint = {
  sol: string;
  sicaklik: string;
  basinc: string;
  toz: string;
  durum: string;
};

export type Region = {
  id: string;
  ad: string;
  sektor: string;
  tanim: string;
  mapPositionX: number;
  mapPositionY: number;
  ozet: string;
  uygunlukSkoru: number;
  riskIndeksi: number;
  genislemeSkoru: number;
  lojistikSkoru: number;
  isruSkoru: number;
  ortalamaEğim: string;
  buzOlasiligi: string;
  tozRiski: string;
  sicaklikAraligi: string;
  inisGuvenligi: string;
  kurulumPenceresi: string;
  habitatModu: string;
  habitatGerekcesi: string;
  magaraPotansiyeli: string;
  kaynakOdaklari: string[];
  cevreOzeti: ClimateMetric[];
  cevreDetaylari: ClimateMetric[];
  havaTahmini: ForecastPoint[];
  nasaReferansNotu: string;
  anaNotlar: string[];
  kirmiziBayraklar: string[];
  katmanlar: string[];
  analizSatirlari: {
    metrik: string;
    deger: string;
    yorum: string;
  }[];
  kaynakBaski: {
    sistem: string;
    normal: string;
    firtina: string;
    aksiyon: string;
  }[];
  fazlar: {
    faz: string;
    odak: string;
    teslimler: string[];
  }[];
};

export type Scenario = {
  ad: string;
  optimizasyon: string;
  gorevUyumu: number;
  risk: number;
  otonomi: number;
  maliyetDisiplini: number;
  aciklama: string;
};

export type PlanModule = {
  ad: string;
  kategori: string;
  faz: string;
  kapasite: string;
  enerji: string;
  aciklama: string;
};

export type ResourceMetric = {
  etiket: string;
  deger: number;
  yorum: string;
};

export type PlanningImpactMetric = {
  etiket: string;
  deger: number;
  yorum: string;
};

export type TimelineItem = {
  baslik: string;
  detay: string;
};

export type ReportSection = {
  baslik: string;
  metin: string;
};

export type ReportTopic = {
  baslik: string;
  seviye: string;
  sorun: string;
  cozum: string;
};
