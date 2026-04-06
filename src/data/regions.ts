import type { Region } from "../types/mission";

export const regions: Region[] = [
  {
    id: "planum_boreum",
    ad: "Planum Boreum",
    mapPositionX: 50,
    mapPositionY: 12,
    sektor: "Sektör 01",
    tanim: "Kuzey kutup başlığına yakın, su buzu erişimi çok güçlü ve yer altı habitat için öncelikli saha.",
    ozet: "Su çıkarımı açısından en güçlü aday; yüzey yerine gömülü yaşam çekirdeği gerektirir.",
    uygunlukSkoru: 82,
    riskIndeksi: 36,
    genislemeSkoru: 69,
    lojistikSkoru: 63,
    isruSkoru: 91,
    ortalamaEğim: "5.4 derece",
    buzOlasiligi: "%96",
    tozRiski: "Düşük-orta",
    sicaklikAraligi: "-128 / -34°C",
    inisGuvenligi: "Kontrollü",
    kurulumPenceresi: "9 ay dar pencere",
    habitatModu: "Yer altı kutup çekirdeği",
    habitatGerekcesi:
      "Yüzey radyasyonu ve termal baskı nedeniyle yaşam modülleri kazılmış galeri veya yarı gömülü kabukta tutulmalı.",
    magaraPotansiyeli:
      "Kutup çevresinde doğrulanmış mağara garantisi yok; doğal boşluk bulunursa ek koruma avantajı olarak değerlendirilir.",
    kaynakOdaklari: ["Su buzu", "Elektroliz", "Regolit kalkanı", "Acil durum su rezervi"],
    cevreOzeti: [
      { etiket: "Yüzey sıcaklığı", deger: "-91°C", yardimci: "Kutup referans bandı" },
      { etiket: "Basınç", deger: "765 Pa", yardimci: "Günlük salınım ±72 Pa" },
      { etiket: "Toz durumu", deger: "İzleme modu", yardimci: "Düşük güneş verimi ile birlikte değerlendirilir" }
    ],
    cevreDetaylari: [
      { etiket: "Solar verim", deger: "%49", yardimci: "Nükleer taban yük önerilir" },
      { etiket: "Radyasyon tamponu", deger: "71/100", yardimci: "Yer altı kalkanı şart" }
    ],
    havaTahmini: [
      { sol: "Sol +1", sicaklik: "-94°C", basinc: "769 Pa", toz: "İzleme modu", durum: "Yüzey EVA kısa tutulmalı." }
    ],
    nasaReferansNotu:
      "NASA Mars Facts ve Water on Mars verileri doğrultusunda kutup buz erişimi yüksek kabul edilmiştir; mağara varlığı ise garanti edilmemiştir.",
    anaNotlar: [
      "Su ekonomisi ve sığınak güvenliği aynı bölgede birleşir.",
      "Yüzey yerine gömülü çekirdek kurmak, enerji kayıplarını ve radyasyon maruziyetini düşürür."
    ],
    kirmiziBayraklar: [
      "Düşük güneş verimi hibrit enerji mimarisini zorunlu kılar.",
      "İlk iniş ve ağır kargo kurulumu için hassas planlama gerekir."
    ],
    katmanlar: ["Kutup buz rezervi", "Gömülü çekirdek hattı", "Yüzey lojistik halkası", "Sığınak galerisi"],
    analizSatirlari: [
      { metrik: "Su erişimi", deger: "Çok güçlü", yorum: "ISRU su zinciri için ana avantaj." }
    ],
    kaynakBaski: [
      { sistem: "Enerji", normal: "-4%", firtina: "-12%", aksiyon: "Nükleer taban yükü koru." }
    ],
    fazlar: [
      { faz: "Faz I", odak: "Sığınak ve su sondajı", teslimler: ["Gömülü yaşam çekirdeği"] }
    ]
  },
  {
    id: "arcadia_planitia",
    ad: "Arcadia Planitia",
    mapPositionX: 67,
    mapPositionY: 28,
    sektor: "Sektör 07",
    tanim: "Kuzey yüksek enlem kuşağında, buz erişimi ile lojistik dengenin en iyi birleştiği saha.",
    ozet: "İlk koloni için en dengeli kutup koridoru; su çıkarımı ve inşa fizibilitesi birlikte güçlü.",
    uygunlukSkoru: 88,
    riskIndeksi: 33,
    genislemeSkoru: 84,
    lojistikSkoru: 81,
    isruSkoru: 86,
    ortalamaEğim: "4.7 derece",
    buzOlasiligi: "%88",
    tozRiski: "Orta",
    sicaklikAraligi: "-104 / -28°C",
    inisGuvenligi: "Yüksek",
    kurulumPenceresi: "14 ay kontrollü pencere",
    habitatModu: "Yarı gömülü hibrit habitat",
    habitatGerekcesi:
      "Su çıkarımı, yüzey lojistiği ve regolit kalkanı aynı anda yönetilebildiği için ilk kalıcı habitat için baz senaryo.",
    magaraPotansiyeli:
      "Doğrudan doğrulanmış mağara ağı yok; doğal boşluk araması yardımcı keşif görevi olarak ele alınır.",
    kaynakOdaklari: ["Gömülü buz", "Regolit yapı blokları", "CO2 işleme", "Robotik bakım"],
    cevreOzeti: [
      { etiket: "Yüzey sıcaklığı", deger: "-74°C", yardimci: "Yüksek enlem referans bandı" },
      { etiket: "Basınç", deger: "728 Pa", yardimci: "Günlük salınım ±58 Pa" },
      { etiket: "Toz durumu", deger: "Orta baskı", yardimci: "Bakım döngüsü düzenli olmalı" }
    ],
    cevreDetaylari: [
      { etiket: "Solar verim", deger: "%66", yardimci: "Güneş + kompakt nükleer dengesi uygun" },
      { etiket: "Radyasyon tamponu", deger: "68/100", yardimci: "Regolit örtü ile güçlenir" }
    ],
    havaTahmini: [
      { sol: "Sol +1", sicaklik: "-73°C", basinc: "731 Pa", toz: "Orta baskı", durum: "Standart EVA penceresi açık." }
    ],
    nasaReferansNotu:
      "NASA Mars Facts, Water on Mars ve MOXIE referansları dikkate alınarak su + ISRU + enerji dengesi oluşturulmuştur.",
    anaNotlar: [
      "Su bağımsızlığı ile iniş güvenliğini birlikte sunar.",
      "İlk kalıcı habitat için en dengeli genişleme koridorudur."
    ],
    kirmiziBayraklar: [
      "Toz sonrası panel temizliği ve robot bakım yükü artar.",
      "Yer üstü habitat yerine yarı gömülü kabuk korunmalıdır."
    ],
    katmanlar: ["Buz damarı", "Yarı gömülü habitat", "Enerji omurgası", "ISRU işleme zonu"],
    analizSatirlari: [
      { metrik: "Genel denge", deger: "Çok güçlü", yorum: "Lojistik ve ISRU aynı anda iyi." }
    ],
    kaynakBaski: [
      { sistem: "Su", normal: "+18%", firtina: "+12%", aksiyon: "ISRU hattını erken devreye al." }
    ],
    fazlar: [
      { faz: "Faz I", odak: "İniş ve çekirdek kurulum", teslimler: ["Yarı gömülü yaşam modülü"] }
    ]
  },
  {
    id: "deuteronilus_mensae",
    ad: "Deuteronilus Mensae",
    mapPositionX: 58,
    mapPositionY: 24,
    sektor: "Sektör 11",
    tanim: "Buz açısından zengin, topoğrafyası daha karmaşık ama doğal koruma potansiyeli yüksek saha.",
    ozet: "Yüzey zorluğu daha fazla; buna karşı doğal örtü ve olası boşluk araştırması için değerli.",
    uygunlukSkoru: 79,
    riskIndeksi: 39,
    genislemeSkoru: 72,
    lojistikSkoru: 68,
    isruSkoru: 84,
    ortalamaEğim: "7.1 derece",
    buzOlasiligi: "%91",
    tozRiski: "Orta",
    sicaklikAraligi: "-109 / -31°C",
    inisGuvenligi: "Orta",
    kurulumPenceresi: "10 ay hassas pencere",
    habitatModu: "Kazılmış galeri + doğal örtü araştırması",
    habitatGerekcesi:
      "Yüzey daha karmaşık olduğu için kazılmış koridorlar ve yamaç koruması, açık habitatlara göre çok daha güvenli.",
    magaraPotansiyeli:
      "Genel Mars verilerinde doğal boşluk ihtimali ilgi çekici olsa da bu sahada kullanıma hazır mağara garantisi yoktur.",
    kaynakOdaklari: ["Buz çıkarımı", "Regolit tünel desteği", "Sığınak derinliği", "Doğal örtü keşfi"],
    cevreOzeti: [
      { etiket: "Yüzey sıcaklığı", deger: "-79°C", yardimci: "Yüksek enlem geçiş kuşağı" },
      { etiket: "Basınç", deger: "714 Pa", yardimci: "Günlük salınım ±55 Pa" },
      { etiket: "Toz durumu", deger: "Orta baskı", yardimci: "Topografya bakım yükünü artırır" }
    ],
    cevreDetaylari: [
      { etiket: "Solar verim", deger: "%61", yardimci: "Hibrit enerji gerekir" },
      { etiket: "Radyasyon tamponu", deger: "70/100", yardimci: "Derin gömülü yaşam tercih edilir" }
    ],
    havaTahmini: [
      { sol: "Sol +1", sicaklik: "-81°C", basinc: "712 Pa", toz: "Orta baskı", durum: "Yamaç operasyonları dikkatli planlanmalı." }
    ],
    nasaReferansNotu:
      "NASA kutup buz çalışmaları ve Mars Odyssey doğal boşluk bulguları ışığında, saha doğal koruma potansiyeli açısından izlenmektedir.",
    anaNotlar: [
      "Su erişimi ve doğal koruma arayışı birlikte değerlendirilebilir.",
      "Savunma jürisi için yer altı odaklı çözümün en güçlü anlatım sahalarından biridir."
    ],
    kirmiziBayraklar: [
      "İniş, yüzey kurulumuna göre daha hassas yaklaşım ister.",
      "İlk fazda robotik keşif ve topoğrafya taraması zorunludur."
    ],
    katmanlar: ["Yüksek enlem buz kuşağı", "Yamaç koruması", "Kazılmış galeri", "Doğal boşluk araştırması"],
    analizSatirlari: [
      { metrik: "Koruma potansiyeli", deger: "Güçlü", yorum: "Yer altı habitat anlatısı için uygun." }
    ],
    kaynakBaski: [
      { sistem: "İnşa", normal: "-7%", firtina: "-15%", aksiyon: "Robotik kazı payını artır." }
    ],
    fazlar: [
      { faz: "Faz I", odak: "Keşif ve güvenli çekirdek", teslimler: ["Topoğrafya haritalama", "Sığınak tüneli"] }
    ]
  }
];
