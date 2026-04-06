# HabitatX Juri Sunum Dosyasi

## 1. Proje Kimligi

**Proje adi:** HabitatX  
**Proje tipi:** Mars kolonizasyonu icin karar destek ve habitat planlama sistemi  
**Temel amac:** Mars'ta kalici veya yari-kalici insan yerlesimi kurmak icin en uygun bolgeyi, operasyon modelini, kaynak stratejisini ve fazli kurulum planini veri destekli sekilde olusturmak.

Bu proje bir "oyun arayuzu" degil; bir **karar destek sistemi** olarak tasarlanmistir. Kullanici sadece bolge secmez. Sistem:

- secilen bolgenin fiziksel uygunlugunu hesaplar,
- gorev brief'ine gore operasyonel etkileri gunceller,
- buna uygun moduller ve kurulum fazlari uretir,
- alternatif senaryolari karsilastirir,
- sonunda sunuma uygun bir AI raporu olusturur.

Kisaca HabitatX'in sordugu soru sunudur:

> "Mars'ta belirli bir ekip, sure ve risk profili icin nerede, nasil ve hangi kaynak omurgasiyla yasam kurulabilir?"

---

## 2. Problem Tanimi

Mars'ta koloni kurmak sadece "uygun bir nokta secmek" degildir. Ayni anda su sorularin hepsine cevap vermek gerekir:

- Nerede inmek daha guvenli?
- Hangi bolgede su buzu erisimi daha guclu?
- Radyasyon riski nerede daha yonetilebilir?
- Yuzey mi, yer alti mi daha mantikli?
- Enerjiyi nasil saglayacagiz?
- Su, oksijen ve yapi malzemesi yerelde uretilebilir mi?
- Dunya'dan ne tasimak zorundayiz?
- Toz, termal degisim, biyoguvenlik ve insan hatalari nasil yonetilecek?
- Farkli risk anlayislarina gore plan nasil degisir?

Bu kadar farkli degiskeni insanlarin tablo ustunde ayni anda degerlendirmesi zordur. HabitatX bu karmasikligi sade bir karar akisina cevirir.

---

## 3. Proje Neden Onemli?

Bu proje onemlidir cunku:

- Mars kolonizasyonunu sadece teorik anlatmaz, karar zincirine cevirir.
- Birden fazla bilimsel parametreyi tek sistemde toplar.
- Kullanici girdisi degistiginde sonucun da degismesini saglar.
- "Tek dogru cevap" vermek yerine alternatif senaryolar olusturur.
- Juriye veya teknik ekibe yalnizca sonuc degil, sonucun **neden oyle oldugunu** da gosterebilir.

HabitatX'in en guclu tarafi, sadece "en iyi bolge burasi" dememesi; ayni zamanda:

- neden bu bolge secildi,
- neden bu enerji modeli kullanildi,
- neden bu moduller Faz I/Faz II/Faz III'e yerlestirildi,
- hangi riskler kabul edildi,
- hangi riskler ekstra onlem gerektiriyor

sorularina cevap verebilmesidir.

---

## 4. Projenin Kisa Calisma Mantigi

Sistem 5 ana adimda calisir:

1. Kullanici ana merkezde bolge, ekip buyuklugu, gorev suresi ve risk profili secer.
2. Kullanici gorev brief ekraninda gorev amaci, enerji ve su stratejisini belirler.
3. Backend secilen bolge icin analiz uretir.
4. Analize ve gorev brief'ine gore plan, moduller, fazlar ve senaryolar olusturulur.
5. Tüm bu ciktılar AI raporu ve sunum odakli arayuz ile gosterilir.

Bu akis tek bir `planning_session` etrafinda döner. Bu cok onemlidir cunku proje butun ekranlari tek bir oturum modeliyle birbirine baglar.

---

## 5. Mimari Genel Bakis

Proje iki ana katmandan olusur:

### Frontend

- React 18
- TypeScript
- Vite

Frontend kullanicinin karar verdigi, veriyi goruntuleyip karsilastirdigi kisimdir.

### Backend

- FastAPI
- SQLAlchemy
- Pydantic
- SQLite gelistirme veritabani

Backend sistemin karar motorudur. Analiz, plan, senaryo ve rapor burada uretilir.

### Neden Bu Ayrim Secildi?

Bu ayrim bilincli yapildi:

- Frontend sadece sunum ve etkileşim icin kullaniliyor.
- Asil karar mantigi backend'de calisiyor.
- Boylece ayni sistem daha sonra baska bir arayuze de baglanabilir.
- Tum hesaplamalar tek kaynakta tutuldugu icin tutarsizlik azalir.

Bu, projeyi "statik arayuz" olmaktan cikarip gercek bir sistem haline getirir.

---

## 6. Neden `planning_session` Merkezde?

Sistemin cekirdek tasarim karari `planning_session` modelidir.

Bu model su bilgileri tek yerde toplar:

- secilen bolge,
- ekip buyuklugu,
- gorev suresi,
- risk profili,
- mission brief,
- analiz ciktisi,
- plan ciktisi,
- senaryolar,
- rapor.

### Neden gerekli?

- Ekranlar arasi veri tekrarini onler.
- Kullanici bir parametre degistirdiginde tum ciktinin guncellenmesini saglar.
- Butun projenin tek kaynaktan beslenmesini saglar.
- Demo ve sunum sirasinda sistemi daha guvenilir hale getirir.

Bu sayede proje "her ekran ayri hesap yapıyor" mantigina dusmez.

---

## 7. Kullanici Akisi

### 7.1 Ana Merkez

Bu ekran kullanicinin en temel kararlari verdigi yerdir:

- bolge secimi,
- ekip buyuklugu,
- gorev suresi,
- risk profili.

Mars bolgeleri etkilesimli bir gorunumle secilir. Bu sunum acisindan onemlidir cunku kullanici sadece dropdown degil, dogrudan Mars uzerinden secim hissi yasiyor.

### 7.2 Gorev Brief'i

Bu ekran gorevin karakterini belirler:

- gorev amaci,
- enerji stratejisi,
- su stratejisi,
- risk profili,
- operasyon etkileri.

Bu ekranin mantigi su: Aynı bolgeye giden her gorev ayni degildir.  
12 kisilik bir arastirma ussu ile 60 kisilik kalici habitat ayni sonucu vermez.

### 7.3 Analiz

Bu ekranda secilen bolgenin:

- uygunluk skoru,
- risk indeksi,
- genisleme skoru,
- lojistik skoru,
- kritik bayraklari,
- guclu yonleri

gosterilir.

### 7.4 Plan

Bu bolumde sistem:

- onerilen modulleri,
- faz bazli kurulum sirasini,
- risk ve kaynak tablosunu,
- senaryo farklarini

sunarak "ne yapmaliyiz?" sorusuna cevap verir.

### 7.5 Rapor

Bu ekran proje ciktisini daha anlatili hale getirir:

- yonetici ozeti,
- teknik ozet,
- aksiyonlar,
- detayli rapor bolumleri.

Yani plan ekranı daha operasyoneldir, rapor ekrani ise daha anlatim odaklidir.

---

## 8. Neden Bu 3 Bolge Secildi?

Projede 3 ana aday bolge vardir:

### Planum Boreum

- Kuzey kutbuna cok yakin
- Su buzu erisimi cok guclu
- Enerji kosullari daha zor
- Yer alti veya yari gomulu habitat icin guclu aday

### Arcadia Planitia

- Buz erisimi ile lojistik dengeyi birlikte sunar
- Daha dengeli kurulum koridorudur
- Ilk kalici yerlesim icin en guclu adaylardan biridir

### Deuteronilus Mensae

- Yuzey daha karmasik
- Buz zenginligi yuksektir
- Doğal korunak veya topografik avantaj arastirmalari icin degerlidir

### Neden Bu 3'lu?

Cunku bu secim tek tip saha yerine uc farkli kolonizasyon mantigini temsil eder:

- maksimum su erisimi,
- dengeli lojistik + kaynak erisimi,
- daha karmaşık ama stratejik arazi.

Bu da juriye sadece "bir nokta sectik" degil, "secim uzayını inceledik" deme imkani verir.

---

## 9. Neden Kutup ve Yuksek Enlem Odakli Bir Yaklasim?

Bu proje bilincli olarak kutup ve yuksek enlem odakli kurulmustur.

### Neden?

- Su buzu Mars'ta en kritik kaynaktir.
- Su sadece icme icin degil:
  - oksijen uretimi,
  - hidrojen kaynagi,
  - yakit onculeri,
  - tarim,
  - termal tampon,
  - radyasyon korumasi
  icin de gerekir.

Yani su = hayatta kalma + otonomi + ISRU.

Bu nedenle sistem "duz zemin" kadar "buz erisimi"ni de agirlikli olarak hesaba katar.

---

## 10. Analiz Motoru Nasil Calisiyor?

Analiz motoru secilen bolgenin ham verisini yorumlanmis skorlara cevirir.

### Girdi Parametreleri

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

### Uretilen Ana Skorlar

#### 1. Site Suitability Score

Sahanin genel uygunlugu.

Bu skorda one cikan mantik:

- inis guvenligi cok kritik,
- buz erisimi hayati,
- insa edilebilirlik ve genisleme potansiyeli gerekli,
- radyasyon negatif etki.

#### 2. Risk Index

Bolgedeki operasyonel tehlikeyi temsil eder.

Ozellikle:

- radyasyon,
- toz,
- krater yogunlugu,
- pürüzlülük

bu skoru etkiler.

#### 3. Expansion Score

Koloninin büyüyebilir olup olmadigini gosterir.

#### 4. Logistics Score

Kargo, iniş, taşıma ve ilk operasyon penceresini temsil eder.

### Neden Bu Skorlar Var?

Cunku tek bir toplam puan karar vermek icin yeterli degildir.  
Bir saha:

- cok guvenli olabilir ama su kaynagi zayif olabilir,
- su acisindan guclu olabilir ama lojistigi zor olabilir,
- cok uygun olabilir ama buyumeye elverissiz olabilir.

Bu yüzden sistem ayriştirilmis skor mantigi ile kurulmustur.

---

## 11. Neden Brief Sonucu Degistiriyor?

Projede cok kritik bir tasarim karari var:

> Aynı bolge, farkli gorev brief'leri icin farkli sonuc üretir.

Bu bilincli bir karardir.

### Ornek

Aynı bolge icin:

- 12 kisilik arastirma ekibi,
- 48 kisilik kalici habitat,
- 72 ay sureli bir operasyon,
- agresif büyüme profili

aynı planı vermez.

### Neden?

Cunku Mars'ta koloni planı sadece araziye bagli degildir. Su parametreler de cok etkilidir:

- ekip buyuklugu,
- gorev suresi,
- enerji tercihi,
- su stratejisi,
- risk toleransi,
- otonomi seviyesi.

Bu yuzden frontend tarafinda brief olusturuluyor, backend tarafinda da o brief planlama motoruna etkide bulunuyor.

---

## 12. Planning Engine Nasil Calisiyor?

Planning engine su sirayla calisir:

1. session okunur
2. mission brief okunur
3. region analysis cekilir
4. kurallar degerlendirilir
5. moduller secilir
6. fazlara dagitilir
7. oneri listesi uretilir

### Modül Secim Mantigi

Sistem kosullu kurallarla modül secer.

Ornek mantik:

- ekip buyukse ek yasam cekirdegi eklenir
- gorev uzunsa ISRU su tesisi eklenir
- otonomi yuksekse uretim podu eklenir
- risk toleransi dusukse regolit kalkani eklenir
- radyasyon veya toz yuksekse batarya ve kalkan erkene cekilir

### Neden Kural Tabanli?

Cunku proje bir kara kutu AI sistemine donusmesin istedik.

Kural tabanli planlama sunlari saglar:

- daha aciklanabilir sonuc,
- daha savunulabilir teknik mantik,
- juriye "neden bu modulu sectiniz?" sorusunda net cevap.

Bu da projeyi daha akademik ve muhendislik odakli yapar.

---

## 13. Modul Katalogu Neden Onemli?

Planlama sadece "genel tavsiye" vermiyor; belirli moduller oneriyor.

Projede tanimli moduller:

- Yasam Cekirdegi
- Yasam Destegi Yedegi
- Yasam Cekirdegi 2
- ISRU Su Tesisi
- Enerji Omurgasi
- Yedek Batarya Bankasi
- Regolit Kalkan Hatti
- Mobil Bakim Hangari
- Uretim Podu
- Tarim Halkasi

### Neden Bu Moduller Secildi?

Cunku bunlar koloni omurgasinin temel bileşenlerini temsil eder:

- yasam
- enerji
- guvenlik
- su
- bakim
- yerel uretim
- gida

Bu da projenin yalnizca "risk skoru veren" bir arac degil, ayni zamanda "kurulum plani uretebilen" bir sistem oldugunu gosterir.

---

## 14. Fazlama Mantigi Neden Var?

HabitatX tek adimda koloni kurmuyor. Faz bazli kurguluyor:

### Faz I

- guvenli kurulum cekirdegi
- yasam destegi
- enerji omurgasi
- radyasyon korumasi

### Faz II

- su ve kaynak altyapisi
- batarya ve bakim
- servis omurgasi

### Faz III

- üretim
- tarim
- ek yasam alani
- buyume

### Neden Fazlama Gerekli?

Cunku gercek uzay projeleri tek seferde maksimum kapasite ile kurulmaz.  
Once hayatta kalma, sonra kaynak bagimsizligi, sonra genisleme gelir.

Bu yapı projeyi gercekçi kılar.

---

## 15. Senaryo Motoru Neden Var?

Sistem 3 ana senaryo üretir:

- Korunakli
- Dengeli
- Agresif Buyume

### Korunakli

- risk azaltma odakli
- daha fazla yedeklilik
- daha dusuk otonomi buyume hizi

### Dengeli

- genel performans odakli
- kaynak, buyume ve guvenlik dengesi

### Agresif Buyume

- hizli kapasite artisi
- daha yuksek risk
- daha yuksek otonomi ve üretim

### Neden Onemli?

Cunku gercek karar verme surecinde tek plan yetmez.  
Karar verici farkli stratejik tavirlari ayni tablo uzerinde gormek ister.

Bu ozellik, proje kalitesini ciddi sekilde yukselten bolumlerden biridir.

---

## 16. ScoreCard Sistemi Neden Var?

Backend tek tek ham verileri frontend'e yikmiyor.  
Bunun yerine normalize skor seti uretiyor:

- site_suitability_score
- mission_fit_score
- resource_access_score
- risk_index
- construction_difficulty
- resilience_score
- autonomy_score
- expansion_score
- sustainability_score
- survival_confidence

### Neden Bu Kadar Onemli?

Cunku farkli ekranlar ayni dili konusuyor:

- analiz ekrani,
- plan ekrani,
- senaryo karsilastirma,
- rapor ekranı

hepsi aynı skor omurgasina dayanıyor.

Bu tutarlilik, sunum sırasında sistemin daha profesyonel görünmesini sağlar.

---

## 17. Rapor Motoru Neden Ayrı Bir Katman?

Rapor motoru yalnızca ekran metni üretmiyor. Şunları bir araya getiriyor:

- session bilgisi,
- mission brief,
- analysis,
- plan,
- score_card,
- scenarios,
- estimated_cost,
- section listesi,
- topic_briefs,
- next_actions.

### Raporun Amaci

Raporun amaci sadece "sonuc gostermek" degil; sonucun arkasındaki teknik mantığı anlatmaktır.

Bu nedenle rapor:

- yonetici ozeti verir,
- teknik ozet sunar,
- uzay risklerini tek tek acar,
- cozum mantigini metinlestirir,
- maliyet ve fazlama cikarir,
- sonraki adimlari listeler.

Bu kisim juri sunumlarinda en guclu materyallerden biridir.

---

## 18. Neden Yer Alti / Yari Gomulu Habitat?

Projenin temel muhendislik kararlarindan biri budur.

### Neden yuzey degil?

Mars yuzeyinde:

- radyasyon yuksek,
- atmosfer cok ince,
- termal fark sert,
- toz asindirmasi kuvvetli,
- manyetik alan yok.

### Neden yer alti veya yari gomulu?

- radyasyon korumasi artar
- termal stabilite artar
- mikrometeorit riski azalir
- uzun kalis icin daha güvenli bir ortam saglanir

### Neden tam dogal magara varsayilmadi?

Cunku bilimsel veriler Mars'ta olasi bosluklar veya lav tupu izleri oldugunu gosterse de:

- secilen her sahada dogrulanmis kullanılabilir mağara yok,
- bu nedenle sistem "magara varsa avantaj" der,
- ama varsayilan cozumü "kazılmış galeri + regolit örtüsü" olarak kurar.

Bu karar projeyi daha gerçekçi ve savunulabilir yapar.

---

## 19. Neden Hibrit Enerji Mimarisi?

Proje tek kaynakli enerji önermiyor.

### Neden?

Mars'ta:

- gunes panelleri tozdan etkilenir,
- kutup yakininda gunes verimi dusuktur,
- uzun sureli karanlik veya verim kaybi olabilir.

Bu nedenle en mantikli yapi:

- temel yukte kompakt nükleer,
- destek yukte gunes,
- tampon icin batarya,
- acil durum icin ayrik güç bankasi

olarak kurgulanmistir.

Bu hibrit model, sistemi daha esnek yapar.

---

## 20. Neden ISRU Bu Kadar Merkezde?

ISRU = In-Situ Resource Utilization  
Yani yerinde kaynak kullanimi.

HabitatX'te ISRU merkezi role sahiptir cunku:

- su Dunya'dan sonsuza kadar tasinamaz,
- oksijenin yerelde uretilmesi gerekir,
- yapi malzemesi icin regolit kullanilabilir,
- CO2 islenerek oksijen ve yakit onculeri üretilebilir.

### Neden merkezde?

Cunku ISRU olmadan:

- ikmal bagimliligi cok artar,
- maliyet yukselir,
- otonomi duser,
- koloni uzun vadede surdurulemez.

Bu nedenle sistemde ISRU sadece "iyi olur" degil, "koloni mimarisinin omurgası" olarak ele aliniyor.

---

## 21. Biyoguvenlik ve Psikoloji Neden Dahil?

Bir Mars kolonisi sadece muhendislik sistemi degildir; ayni zamanda insan sistemidir.

Bu yuzden projede:

- psikolojik saglik,
- ic guvenlik,
- karar yorgunlugu,
- insan hatasi,
- mikrobiyal kontaminasyon,
- karantina protokolleri

da hesaba katilmiştir.

### Neden bu kritik?

Cunku uzun sure kapali ortamda en zayif halka genellikle insan faktorudur.

Bu projenin guclu yani, Mars kolonizasyonunu sadece teknik donanim problemine indirgememesidir.

---

## 22. Haberlesme Gecikmesi Neden Bu Kadar Onemli?

Dunya-Mars iletisiminde anlik kontrol yoktur.  
Dakikalar seviyesinde gecikme olabilir.

Bu nedenle:

- saha kararlari lokal alinmali,
- on tanimli acil durum matrisleri olmali,
- AI destekli karar yardimi saglanmali,
- ama nihai insan denetimi korunmali.

Bu yaklaşım projeyi daha bilim kurgu gibi degil, gerçek operasyon gibi gösterir.

---

## 23. Bu Projenin Teknik Güçlü Yönleri

### 1. Uçtan Uca Akış Var

Secim -> analiz -> plan -> senaryo -> rapor zinciri tamam.

### 2. Açıklanabilir Karar Mantığı Var

Kural tabanlı motor, skor sistemleri ve fazlama açık şekilde savunulabilir.

### 3. Aynı Verinin Farklı Katmanlarda Tutarlı Kullanımı Var

Session, scorecard ve rapor payload yapısı bu tutarlılığı sağlar.

### 4. Sadece Görsel Değil

Sistem arkasında gerçek backend karar akışı var.

### 5. Uzay Problemi Çok Boyutlu Ele Alınıyor

Saha, enerji, su, psikoloji, biyogüvenlik, haberleşme ve insan hatası birlikte düşünülüyor.

---

## 24. Mevcut Sınırlar ve Dürüstçe Söylenmesi Gerekenler

Sunumda dürüst olmak projeyi zayıflatmaz; aksine güçlendirir.

### Bu proje neleri yapmıyor?

- Mars'tan gerçek zamanlı veri çekmiyor.
- Tam fizik tabanlı simülasyon yapmıyor.
- CFD, radyasyon transport veya gerçek maliyet hesabı seviyesinde detaylı mühendislik çözümü sunmuyor.
- Doğrulanmış mağara veya gerçek saha sondajı verisi kullanmıyor.

### Bu proje ne yapıyor?

- Bilimsel referanslarla tutarlı bir karar destek katmanı sunuyor.
- Kullanıcı brief'ine göre sonuç değiştiriyor.
- Açıklanabilir ve geliştirilebilir bir habitat planlama iskeleti veriyor.

Bu çizgi çok önemlidir:  
HabitatX bir **nihai koloni inşa sistemi** değil; bir **karar destek ve planlama sistemi**dir.

---

## 25. Juriye Sunarken Kullanılabilecek Ana Mesaj

Sunumun ana cümlesi şu olabilir:

> "HabitatX, Mars'ta koloni kurma kararını yalnızca konum seçimine indirmeyen; saha analizi, kaynak bağımsızlığı, risk yönetimi, fazlı kurulum, senaryo karşılaştırma ve rapor üretimini tek zincirde birleştiren bir karar destek sistemidir."

Daha kısa versiyonu:

> "Biz Mars'ta sadece nereye ineceğimizi değil, orada nasıl yaşayacağımızı planlıyoruz."

---

## 26. Muhtemel Juri Sorulari ve Cevaplari

### Soru: Neden Mars, neden Ay degil?

Cevap:  
Mars, CO2 iceren atmosferi, daha zengin su senaryolari, Dunya'ya daha yakin gun dongusu ve coklu ISRU kombinasyonu sayesinde uzun vadeli habitat ekonomisi icin daha elverislidir.

### Soru: Neden kutup ve yuksek enlem odakli gittiniz?

Cevap:  
Su buzu erisimi koloninin hayatta kalma, oksijen uretimi, yakit onculeri ve radyasyon tamponu icin ana girdidir. Bu nedenle su merkezli saha secimi yaptik.

### Soru: Neden yer alti habitat?

Cevap:  
Mars'ta radyasyon, termal sertlik ve ince atmosfer nedeniyle tam yüzey yerleşimi uzun kalış için daha risklidir. Yer altı veya yarı gömülü yapı daha güvenli çözümdür.

### Soru: Neden kural tabanli bir motor kullandiniz?

Cevap:  
Cunku juriye ve teknik ekibe "neden bu cikti geldi?" sorusunun net cevabini vermek istedik. Aciklanabilirlik bizim icin oncelikliydi.

### Soru: Sistem neden brief'e gore sonucu degistiriyor?

Cevap:  
Cunku ayni bolge farklı görevler için aynı değildir. Ekip büyüklüğü, görev süresi, enerji ve su stratejisi operasyonel sonucu doğrudan değiştirir.

### Soru: Bu sistem gercek veri mi kullaniyor?

Cevap:  
Ham parametreler NASA temelli bilimsel referanslardan esinlenmis model verileridir. Sistem gerçek zamanlı ölçüm değil, karar destek simülasyonu sunar.

---

## 27. Demo Akisi Onerisi

Sunumda şu sırayla ilerlemek en doğru akış olur:

1. Ana merkezde 3 bolgeyi göster.
2. Neden kutup/yuksek enlem odakli oldugunu anlat.
3. Ekip, sure ve risk profilini degistir.
4. Gorev brief ekraninda enerji ve su stratejisini sec.
5. Analizi calistir.
6. Analiz ekraninda uygunluk, risk, lojistik ve genisleme skorlarini anlat.
7. Plan ekraninda modulleri ve fazlamayi goster.
8. Risk ve kaynak ekraninda uzay sorunlari + cozumleri göster.
9. Senaryolarda korunakli / dengeli / agresif büyümeyi karsilastir.
10. Rapor ekraninda ozet ve detayli raporu ac.

Bu akış projeyi "butunsel sistem" olarak gösterir.

---

## 28. Geliştirme ve Çalıştırma Notu

### Backend

```powershell
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```powershell
npm install
cmd /c npm run dev
```

### Tek Komut

```powershell
cmd /c npm run dev:all
```

### Build

```powershell
cmd /c npm run build
```

### Backend Testleri

```powershell
pytest backend\tests
```

---

## 29. Sonuc

HabitatX'in ana değeri şudur:

- veri temelli saha seçimi yapar,
- görev brief'ini sonuçlara yansıtır,
- planlama motoru ile somut kurulum önerileri üretir,
- senaryoları karşılaştırır,
- tüm çıktıyı rapora dönüştürür.

Yani bu proje:

- sadece bir Mars arayuzu degil,
- sadece bir skor tablosu degil,
- sadece bir rapor üretici degil,

aynı anda bunların hepsini birbirine bağlayan bir **Mars kolonizasyon karar destek platformudur**.

Sunumda en guclu cümleniz şu olabilir:

> "HabitatX, Mars'ta yaşamı tek bir koordinat seçimi olarak değil; kaynak, güvenlik, insan faktörü ve büyüme planı ile birlikte ele alan bütünsel bir sistemdir."

