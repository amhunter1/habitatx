# HabitatX Asama Asama Anlatim

## 1. Bu Program Ne Yapiyor?

HabitatX, Mars'ta bir koloni kurmak icin karar vermeye yardim eden bir programdir.

Bu program sunu yapmaya calisir:

- Mars'ta hangi bolgenin daha uygun oldugunu bulmak
- O bolgede yasam kurmak icin hangi sistemlerin gerekli oldugunu belirlemek
- Riskleri gormek
- Enerji, su, oksijen ve yasam destegi gibi temel ihtiyaclari planlamak
- Sonunda da butun bunlari rapor haline getirmek

Kisaca:

> "Mars'ta nereye, nasil ve hangi sirayla yerlesmeliyiz?"

Bu program bu soruya cevap verir.

---

## 2. Programi Hic Bilmeyen Biri Nasil Dusunmeli?

Bu programi bir "Mars planlama asistani" gibi dusunebilirsin.

Sen ona su bilgileri veriyorsun:

- hangi bolgeyle ilgilendigini
- kac kisilik ekip oldugunu
- gorevin ne kadar surecegini
- ne kadar risk almak istedigini
- enerji ve suyu nasil yonetecegini

Program da sana sunlari soyluyor:

- bu bolge iyi mi kotu mu
- en buyuk tehlikeler neler
- hangi moduller kurulmalı
- önce ne yapilmali
- hangi strateji daha mantikli

---

## 3. Program Acildiginda Ilk Ne Oluyor?

Program acildiginda arka tarafta otomatik olarak yeni bir planlama oturumu olusturulur.

Bu oturumun amaci:

- secilecek tum bilgileri tek yerde toplamak
- daha sonra analiz, plan ve raporu ayni veriye baglamak

Yani sistem daha ilk anda "bu kullanicinin Mars planini takip edecegim" diye bir oturum baslatir.

---

## 4. 1. Asama: Ana Merkez Ekrani

Bu ekran kullanicinin ilk karar verdigi yerdir.

Burada kullanici 4 ana sey secer:

1. Hangi Mars bolgesi
2. Ekip buyuklugu
3. Gorev suresi
4. Risk profili

### 4.1 Bolge Secimi

Kullanici Mars uzerindeki aday bolgelerden birini secer.

Bu bolgeler rastgele degildir. Sistem onceden 3 stratejik bolge tanimlamistir:

- Planum Boreum
- Arcadia Planitia
- Deuteronilus Mensae

Bu bolgelerin secilme nedeni:

- su buzu erisimi
- lojistik denge
- radyasyon ve zemin kosullari
- genisleme potansiyeli

### 4.2 Ekip Buyuklugu

Kullanici kac kisilik bir ekip gonderecegini belirler.

Bu neden onemli?

Cunku:

- daha cok kisi = daha cok yasam alani
- daha cok kisi = daha cok su, gida, oksijen
- daha cok kisi = daha fazla bakim ve enerji ihtiyaci

### 4.3 Gorev Suresi

Kullanici gorevin kac ay surecegini secer.

Bu neden onemli?

Cunku:

- kisa gorev ile uzun gorev ayni planı istemez
- sure arttikca yedeklilik ihtiyaci artar
- su, gida ve enerji planlamasi buyur
- uzun sureli gorevlerde ISRU daha kritik hale gelir

### 4.4 Risk Profili

Kullanici risk anlayisini belirler.

Secenekler:

- Korunakli
- Dengeli
- Agresif buyume

Bu secim sistemin karakterini degistirir.

Ornek:

- Korunakli secilirse sistem daha fazla yedeklilik ister
- Agresif buyume secilirse sistem daha hizli genislemeyi one cikarir

---

## 5. 2. Asama: Gorev Brief Ekrani

Bu ekran "gorevin karakterini" belirler.

Burada kullanici biraz daha detay verir:

- gorev amaci
- enerji stratejisi
- su stratejisi

### 5.1 Gorev Amaci

Kullanici su tiplerden birini secer:

- Kalici habitat
- Arastirma ussu
- Uretim onculu

Bu neden onemli?

Cunku gorevin amaci değişirse plan da degisir.

Ornek:

- Arastirma ussu daha küçük ve daha kontrollu olabilir
- Kalici habitat daha fazla yasam altyapisi ister
- Uretim onculu senaryoda yerel üretim modulleri daha onemli olur

### 5.2 Enerji Stratejisi

Kullanici enerji tercih eder:

- Gunes + kompakt nukleer
- Agirlikli gunes
- Agirlikli nukleer

Bu neden onemli?

Cunku Mars'ta enerji, koloninin omurgasidir.

- Gunes paneli tozdan etkilenir
- Nukleer daha stabil olabilir
- Hibrit sistem daha guvenli olabilir

### 5.3 Su Stratejisi

Kullanici su stratejisini secer:

- Buz cikarimi + geri kazanim
- Agirlikli geri kazanim

Bu neden onemli?

Cunku su:

- icme,
- oksijen uretimi,
- gida,
- yakit onculeri,
- termal denge

icin gereklidir.

---

## 6. Bu Ekranda Sistem Arkada Ne Yapiyor?

Kullanici bu secimleri yaparken sistem bu verileri `mission brief` haline getirir.

Yani secilen bilgiler backend'e su tarz seyler olarak gider:

- hedef nufus
- enerji modeli
- habitat tipi
- su modeli
- otonomi seviyesi
- robot sayisi
- risk toleransi

Bu cok onemli cunku program sadece "ekranda secim" yapmiyor; bu secimleri sayisal ve karar verilebilir veriye ceviriyor.

---

## 7. 3. Asama: Analiz Baslatma

Kullanici "Analiz sonuclarini hesapla" dediginde asıl sistem calismaya baslar.

Bu anda backend sirayla sunlari yapar:

1. Mission brief'i kaydeder
2. Secilen bolgeyi analiz eder
3. Plan uretir
4. Senaryolari uretir
5. Rapor uretir

Yani tek butonla tum karar zinciri baslar.

---

## 8. 4. Asama: Bolge Analizi

Bu asamada sistem secilen Mars bolgesini değerlendirir.

Kullandigi temel bolge verileri:

- egim
- pürüzlülük
- krater yogunlugu
- radyasyon
- toz riski
- buz olasiligi
- termal aralik
- gunes verimi
- inis guvenligi
- genisleme alani
- insa edilebilirlik

### Sistem Bu Verilerle Ne Uretir?

4 ana skor:

- Uygunluk
- Risk
- Genisleme
- Lojistik

### 8.1 Uygunluk Skoru

Bu bolgede yasam kurmak genel olarak ne kadar mantikli?

### 8.2 Risk Indeksi

Bu bolgede ne kadar tehlike var?

### 8.3 Genisleme Skoru

Koloni buyuyebilir mi?

### 8.4 Lojistik Skoru

Inis, tasima ve kurulum ne kadar rahat olur?

---

## 9. Sistem Neden Kirmizi Bayraklar Veriyor?

Analiz ekraninda sadece puan yoktur. Bir de "kirmizi bayraklar" vardir.

Bunlar sistemin tehlikeli gördüğü durumları kisa cümlelerle belirtir.

Ornek:

- radyasyon fazla olabilir
- toz riski fazla olabilir
- inis zorlugu olabilir
- su erisimi yetersiz olabilir

Bu neden faydali?

Cunku kullanici sadece sayı gormez; sorunun ne oldugunu da anlar.

---

## 10. Sistem Neden Guclu Yonler de Gosteriyor?

Program sadece risk gostermez.

Ayni zamanda su gibi avantajlari da gosterir:

- guclu buz erisimi
- iyi lojistik
- guclu genisleme alani
- uygun saha yapisi

Bu denge önemlidir.  
Cunku bir bolge tamamen kotu veya tamamen iyi olmayabilir.

---

## 11. 5. Asama: Plan Uretimi

Analiz tamamlaninca sistem plan motorunu calistirir.

Bu kisim sunu yapar:

- hangi modullerin kurulacagini belirler
- bunlari hangi fazda kuracagini belirler
- ana kisitlari çıkarır
- kaynak darboğazlarını çıkarır
- en önemli önerileri listeler

Yani sistem:

> "Bu bolgeyi sectin, bu kadar kisilik ekip goturuyorsun, bu kadar sure kalacaksin; o zaman su plan mantikli"

demis olur.

---

## 12. Sistem Modulleri Neye Gore Seciyor?

Program modulleri kurallara göre secer.

Ornek mantik:

- ekip buyukse ek yasam cekirdegi gerekir
- sure uzunsa ISRU su tesisi gerekir
- risk dusukse daha az koruma olabilir
- risk yuksekse regolit kalkani gerekir
- otonomi yuksekse üretim podu gerekir

Bu guzel cunku sonuc rastgele degil, aciklanabilir.

---

## 13. Plan Ekraninda Kullanici Ne Gorur?

Plan ekraninda kullanici sunlari gorur:

- secili senaryo
- uygunluk / risk gibi genel veriler
- ana plan direktifleri
- onerilen moduller
- faz bazli kurulum zamanlamasi

Bu ekranin mantigi:

> "Tamam, analiz ettik. Simdi ne kuracagiz?"

---

## 14. Fazlar Neden Var?

Program koloniyi tek adımda kurmaz.

Fazli kurulum mantigi vardir:

- Faz I: once hayatta kalma
- Faz II: sonra kaynak bagimsizligi
- Faz III: sonra buyume

Bu yaklaşim çok önemlidir cunku gercek uzay projeleri de boyle planlanir.

---

## 15. 6. Asama: Risk ve Kaynak Ekrani

Bu ekran planin daha operasyonel tarafidir.

Burada sistem sunlari gosterir:

- operasyon metrikleri
- risk haritasi
- uzayla ilgili kritik sorunlar ve çözümleri
- kaynak baskisi tablosu

### Bu ekran neden önemli?

Cunku burada sistem sadece "ne kur" demez.

Ayni zamanda:

- hangi risk var,
- bu riske nasil cevap veriliyor,
- enerji ve su nerede zorlanacak,
- firtina veya stres aninda ne olacak

gibi kritik konulari da gosterir.

---

## 16. "Uzay Sorunlari ve Cozumleri" Kismi Ne Is Yapiyor?

Bu kisimda sistem uzayla ilgili temel problemleri listeler:

- yolculuk tehlikeleri
- psikolojik saglik
- Mars radyasyon ve atmosfer kosullari
- yerlesim secimi
- enerji omurgasi
- Dunyadan tasinacak kritik yukler
- ISRU
- biyoguvenlik
- haberlesme gecikmesi

Ve bunlarin yanina su sorunun cevabini koyar:

> "Bu probleme projede nasil cevap veriyoruz?"

Bu kisim teknik savunma icin cok gucludur cunku sadece problem degil, çözüm de gösterilir.

---

## 17. Risk Haritasi Ne Demek?

Risk haritasi, bir tür gorsel maruziyet matrisi gibi calisir.

Amaci:

- riskin siddetini tek bakista gostermek
- kullaniciya "hangi alanlar daha alarm veriyor" hissi vermek

Bu kisim tamamen bilimsel harita değildir; daha cok karar destek gorselleştirmesidir.

---

## 18. Kaynak Baskisi Tablosu Ne Yapiyor?

Bu tabloda sistem sunu gosterir:

- normal kosulda kaynaklar nasil davraniyor
- firtina veya stres kosulunda ne degisiyor
- bu durumda ne aksiyon alinmali

Bu güzel cunku Mars'ta sadece en iyi gun degil, en kotu gun de planlanmalidir.

---

## 19. 7. Asama: Senaryo Karsilastirma

Sistem 3 farkli plan senaryosu uretir:

- Korunakli
- Dengeli
- Agresif Buyume

Bu senaryolar ayni veriden uretilir ama oncelikleri farklidir.

### Korunakli

- risk azaltma odakli
- daha fazla tampon
- daha fazla guvenlik

### Dengeli

- genel optimum
- kaynak ve guvenlik dengesi

### Agresif Buyume

- daha hizli buyume
- daha yuksek otonomi
- daha yuksek risk

Bu ekran kullaniciya su soruyu sordurur:

> "Biz ne kadar hizli buyumek istiyoruz ve ne kadar risk alabiliriz?"

---

## 20. 8. Asama: Rapor Ekrani

Bu ekran projenin anlatim tarafidir.

Burada sistem:

- yonetici ozeti
- teknik ozet
- ilk aksiyonlar
- detayli rapor bolumleri

gosterir.

Bu ekranin mantigi:

> "Tum teknik hesaplar bitti. Simdi bunu okunabilir hale getirelim."

---

## 21. Detaylari Goster Butonu Ne Yapiyor?

Bu butona basilinca sistem raporu daha detayli acar.

Burada:

- one cikan bolumler
- tum rapor basliklari
- aksiyon listesi

gorulur.

Bu, teknik sunum veya açıklama için yararlıdır.

---

## 22. Program Neden Rapor da Uretiyor?

Cunku teknik sistemin sonunda sadece ekran yeterli olmayabilir.

Insanlar bazen:

- sonucu okumak ister
- neden bu karar verildiğini bilmek ister
- teknik bir özet görmek ister

Bu yüzden rapor motoru vardır.

Bu rapor:

- secilen bolgeyi anlatir
- riskleri anlatir
- enerji ve ISRU stratejisini aciklar
- yapılacak işleri listeler

---

## 23. Programin Arkasinda Neler Var?

Arka tarafta su ana sistemler vardir:

### 23.1 Session Sistemi

Tum kullanici kararlarini tek yerde toplar.

### 23.2 Analysis Engine

Bolgeyi analiz eder.

### 23.3 Planning Engine

Hangi modullerin kurulacagini belirler.

### 23.4 Scenario Engine

Alternatif stratejiler üretir.

### 23.5 Report Engine

Tum ciktıyı rapora cevirir.

Bu bes katman birlikte calisir.

---

## 24. Program Neden Tek Seferde Herseyi Hesapliyor?

Kullanici bir parametreyi degistirdiginde:

- bolge analizi,
- plan,
- senaryo,
- rapor

yeniden uretilebilir.

Bu neden iyi?

Cunku sistem eski kararlarla yeni kararları karıştırmaz.

Yani:

> "Bolge degisti ama plan eski kaldi"

gibi bir durum olmasin diye zincir beraber guncellenir.

---

## 25. Bu Programda AI Nerede?

Bu projede AI kelimesi geciyor ama sistemin tumü "kara kutu AI" degildir.

Asıl mantik:

- kural tabanli kararlar
- skor hesaplari
- fazlama
- senaryo üretimi

uzerinden calisir.

AI tarafı daha cok:

- rapor anlatimi,
- konu basliklarini duzenleme,
- kararın okunabilir hale getirilmesi

tarafinda ortaya çıkar.

Bu da projeyi daha savunulabilir kilar.

---

## 26. Programin En Guzel Tarafi Ne?

Bu programin en guclu tarafi sunudur:

Sadece "hangi bolge iyi?" demiyor.

Ayni zamanda:

- neden iyi,
- ne riski var,
- ne kurulmali,
- hangi sirayla kurulmalı,
- hangi strateji daha mantikli

sorularina da cevap veriyor.

---

## 27. Kisa Bir Ozetle Tum Akis

Sifirdan birine cok kisa anlatmak istersen proje su sekilde calisir:

1. Kullanici Mars'ta bir bolge secer.
2. Ekip buyuklugu ve gorev suresini belirler.
3. Risk, enerji ve su stratejisini secer.
4. Sistem secilen bolgeyi analiz eder.
5. Risk, lojistik, uygunluk ve genisleme skorlarini hesaplar.
6. Buna gore modulleri ve kurulum fazlarini belirler.
7. Alternatif senaryolar üretir.
8. Sonuclari risk, kaynak ve rapor ekranlarinda gosterir.

Yani:

> secim -> analiz -> plan -> senaryo -> rapor

akisi vardir.

---

## 28. Bu Programi Sunarken Tek Cumlede Nasil Anlatiriz?

Su cümle cok işe yarar:

> "HabitatX, Mars'ta nereye yerleşileceğini, orada nasıl yaşanacağını ve bunun hangi sırayla kurulacağını hesaplayan bir karar destek sistemidir."

Bir tane daha:

> "Bu program yalnızca bölge seçmiyor; Mars'ta yaşam kurma sürecini adım adım planlıyor."

---

## 29. Sonuc

HabitatX'i hic bilmeyen biri icin en doğru özet şudur:

Bu program:

- kullanicidan birkaç temel karar alır,
- Mars bolgesini analiz eder,
- riskleri ve avantajlari hesaplar,
- bir koloni plani çıkarır,
- alternatif stratejiler gösterir,
- sonunda tüm bunları okunabilir bir rapora dönüştürür.

Yani bu proje sadece görsel bir arayüz değil; arkasında gerçek karar mantığı olan bir Mars planlama sistemidir.

