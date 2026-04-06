import { Panel } from "../../components/ui/Panel";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { DataTable } from "../../components/ui/DataTable";

export function SourcesView() {
    return (
        <div className="stack-xl">
            {/* ── Genel Bilgi ── */}
            <Panel>
                <SectionHeader
                    etiket="Hakkında"
                    baslik="Veri kaynakları ve hesaplama metodolojisi"
                    aciklama="Bu sayfa HabitatX DSS'in analiz, plan ve değerlendirme ekranlarında gösterilen verilerin nasıl hesaplandığını ve hangi bilimsel kaynaklara dayandığını açıklar."
                />
                <article className="summary-note-card">
                    <strong>Neden bu sisteme ihtiyaç var?</strong>
                    <p>
                        Mars'ta bir habitat kurmak için yüzlerce değişken var: sıcaklık, basınç, buz erişimi,
                        radyasyon, toz fırtınaları, enerji kapasitesi... İnsan bunları tek tek karşılaştıramaz.
                        Bu sistem tüm bu verileri alıp "bu bölge bu görev için ne kadar uygun?" sorusuna
                        tek bir skorla cevap veriyor. Böylece karar vericiler binlerce saatlik analizi birkaç
                        dakikada görebiliyor.
                    </p>
                </article>
                <article className="summary-note-card">
                    <strong>Veri nereden geliyor?</strong>
                    <p>
                        Temel fiziksel veriler (sıcaklık, basınç, buz olasılığı, radyasyon) NASA'nın Mars
                        keşif misyonlarından geliyor. Bu ham verilerin üzerine görev brief'i (ekip büyüklüğü,
                        süre, enerji stratejisi, risk profili) gibi kullanıcı kararları ekleniyor. Sonuç olarak
                        her farklı görev planı aynı bölge için farklı sonuçlar üretiyor — çünkü 12 kişilik
                        bir araştırma ekibiyle 60 kişilik kalıcı bir habitat kurmanın gereksinimleri tamamen farklı.
                    </p>
                </article>
            </Panel>

            {/* ── NASA / Bilimsel Kaynaklar ── */}
            <Panel>
                <SectionHeader
                    etiket="Bilimsel referanslar"
                    baslik="Neye dayanıyor? Temel veri kaynakları"
                    aciklama="Sistemde kullanılan tüm veriler aşağıdaki bilimsel kaynaklardan alınmıştır."
                />
                <DataTable
                    columns={["Kaynak", "Ne öğreniyoruz?", "Nerede kullanıyoruz?", "Referans"]}
                    rows={[
                        [
                            "NASA Mars Facts",
                            "Mars'ın ortalama sıcaklığı −63°C, atmosfer basıncı ~720 Pa, %95.3 CO₂ atmosferi",
                            "Sıcaklık ve basınç hesaplarının başlangıç noktası olarak kullanıyoruz. Tüm çevresel veriler bu referansa dayanıyor.",
                            "mars.nasa.gov/all-about-mars/facts"
                        ],
                        [
                            "NASA Water on Mars",
                            "Mars'ın kutuplarında ve yüzey altında su buzu var. Kuzey kutup buzulları en güçlü kaynak.",
                            "Buz olasılığı skoru ve su çıkarım stratejisi bu bulgulara dayanıyor. Buz = su = hayatta kalma.",
                            "science.nasa.gov/resource/water-on-mars"
                        ],
                        [
                            "Mars Odyssey / THEMIS",
                            "Termal ataleti ölçerek yüzey altında nerede buz olduğunu gösteriyor.",
                            "Bölge kataloğundaki ice_probability değeri bu verilere dayanıyor. Yüksek termal ataleti = büyük olasılıkla buz var.",
                            "mars.nasa.gov/odyssey"
                        ],
                        [
                            "MOXIE Deneyimi (Perseverance)",
                            "Mars atmosferindeki CO₂'den oksijen üretmenin mümkün olduğunu kanıtladı.",
                            "ISRU (yerinde kaynak kullanımı) skorlarımız bu deneyin fizibilitesine dayanıyor. Oksijen üretimi = koloninin kendi kendine yetmesi.",
                            "mars.nasa.gov/mars2020/spacecraft/instruments/moxie"
                        ],
                        [
                            "MRO / HiRISE",
                            "Mars yüzeyinin en detaylı fotoğraflarını çekiyor. Eğim, pürüzlülük, krater yoğunluğunu ölçüyor.",
                            "İniş güvenliği ve inşa fizibilitesi hesabının temeli. Düz ve pürüzsüz yüzey = güvenli iniş + kolay inşaat.",
                            "mars.nasa.gov/mro"
                        ],
                        [
                            "NASA Mars Cave Araştırmaları",
                            "Mars'ta lav tüpü mağaralar ve çökmüş tavan yapıları (skylight) bulundu.",
                            "Yer altı habitat stratejimizin bilimsel gerekçesi. Mağara = radyasyondan doğal koruma. Ama garanti mağara yok, bu yüzden 'kazılmış tünel' varsayıyoruz.",
                            "nasa.gov/feature/jpl/mars-pits-caves"
                        ],
                        [
                            "NASA Radyasyon Verileri (SRAG)",
                            "Mars'ta yüzeyde Dünya'dakinin ~2.5 katı radyasyon var. Solar flare sırasında çok daha fazla.",
                            "Radyasyon tamponu hesabı ve regolit kalkan kalınlığı önerisi buradan geliyor. Yüksek radyasyon = yer altı habitat zorunlu.",
                            "srag.jsc.nasa.gov"
                        ],
                        [
                            "Mars DRA 5.0 (NASA SP-2009-566)",
                            "NASA'nın resmi Mars görev mimari referansı. Ekip büyüklüğü, görev süresi, habitat tipi önerileri.",
                            "Ekip büyüklüğü aralığı (12-60), görev süresi seçenekleri ve habitat mimari kararlarımız bu belgeyle uyumlu.",
                            "NASA SP-2009-566"
                        ]
                    ]}
                />
            </Panel>

            {/* ── Saha Skorları ── */}
            <Panel>
                <SectionHeader
                    etiket="Ana skorlar"
                    baslik="4 ana skor nasıl hesaplanıyor ve NEDEN böyle?"
                    aciklama="Analiz sayfasındaki uygunluk, risk, genişleme ve lojistik skorlarının mantığı."
                />
                <article className="summary-note-card">
                    <strong>Uygunluk skoru — "Bu bölge habitat kurmak için ne kadar uygun?"</strong>
                    <p>
                        Neden bu ağırlıklar? Çünkü Mars'ta en kritik şey güvenli iniş (%24) ve su buzu (%22).
                        İnemezsek hiçbir şey yapamayız, su bulamazsak hayatta kalamayız. Sonra genişleme alanı
                        (%18) — koloni büyüyebilecek mi? Ve inşa edilebilirlik (%16) — zemin sert mi, düz mü?
                    </p>
                    <p>
                        Formül: 0.24×İniş güvenliği + 0.22×Buz olasılığı + 0.18×Genişleme alanı +
                        0.16×İnşa fizibilitesi + 0.10×Güneş verimi − 0.10×Radyasyon.
                        Sonuç %60 bölge verisi + %40 görev brief uyumu ile harmanlanır.
                    </p>
                </article>
                <article className="summary-note-card">
                    <strong>Risk indeksi — "Bu bölgede ne kadar tehlike var?"</strong>
                    <p>
                        Neden bu ağırlıklar? Mars'taki en büyük tehlike radyasyon (%34) — görünmez ama öldürücü.
                        İkinci büyük tehlike toz fırtınaları (%28) — Mars'ı aylarca karartabiliyor, güneş panelleri
                        çalışmaz hale geliyor. Krater yoğunluğu (%20) ve pürüzlülük (%18) ise iniş ve inşaat riskini artırıyor.
                    </p>
                    <p>
                        Formül: 0.34×Radyasyon + 0.28×Toz riski + 0.20×Krater yoğunluğu + 0.18×Pürüzlülük.
                        Sonuç %60 bölge verisi + %40 görev risk profili ile harmanlanır.
                    </p>
                </article>
                <article className="summary-note-card">
                    <strong>Genişleme skoru — "Koloni büyüyebilir mi?"</strong>
                    <p>
                        Neden bu ağırlıklar? Bir koloni sadece hayatta kalmak için değil, büyümek için de kurulur.
                        En önemli etken düz ve geniş alan (%40) — tünel kazabilecek yer var mı? Sonra inşa
                        fizibilitesi (%22), iniş güvenliği (%18 — ek modüller de indirilecek) ve buz (%20 —
                        büyüyen nüfusa yetecek mi?).
                    </p>
                </article>
                <article className="summary-note-card">
                    <strong>Lojistik skoru — "Malzeme taşıyabilir miyiz?"</strong>
                    <p>
                        Neden bu ağırlıklar? Her şeyi üretemeyiz, Dünya'dan malzeme gelecek. İniş güvenliği (%38)
                        en kritik — kargo gemileri güvenle inebilmeli. Güneş verimi (%22) — enerji lojistiğin
                        temelidir. İnşa fizibilitesi (%20) — indirilen parçalar monte edilebilmeli. Pürüzlülük ve
                        krater (−%10, −%10) — kara taşımacılığını engelliyor.
                    </p>
                </article>
                <article className="summary-note-card">
                    <strong>Neden %60 bölge + %40 brief karışımı?</strong>
                    <p>
                        Bölgenin fiziksel gerçekliği (eğim, buz, radyasyon) değişmez — bu %60'lık kısım.
                        Ama aynı bölgeye 12 kişilik araştırma ekibi göndermekle 60 kişilik kalıcı koloni kurmak
                        arasında devasa fark var — bu %40'lık brief etkisi. Böylece aynı nokta farklı görevler
                        için farklı skorlar üretir. Jüri bunu görmek istiyor: "veriye dayalı karar verme."
                    </p>
                </article>
            </Panel>

            {/* ── Çevresel ── */}
            <Panel>
                <SectionHeader
                    etiket="Çevre metrikleri"
                    baslik="Sıcaklık, basınç, toz — nasıl hesaplanıyor?"
                    aciklama="Çevresel koşullar özeti bölümündeki değerlerin arkasındaki mantık."
                />
                <article className="summary-note-card">
                    <strong>Yüzey sıcaklığı</strong>
                    <p>
                        Başlangıç noktası NASA referansı: Mars ortalaması −63°C. Üzerine bölgenin termal aralığı,
                        güneş verimi ve enlem düzeltmesi ekleniyor. Kutuplara yakın bölgeler daha soğuk çünkü güneş
                        yüzeye daha eğik açıyla vuruyor. Brief etkisi: yüksek dayanıklılık skoru (resilience)
                        sıcaklığı "yukarı çeker" — çünkü daha dayanıklı bir sistem termal izolasyonu daha iyi
                        yönetir, iç ortamı daha stabil tutar.
                    </p>
                </article>
                <article className="summary-note-card">
                    <strong>Atmosfer basıncı</strong>
                    <p>
                        Mars ortalaması ~720 Pa (Dünya'nın %0.6'sı!). Bölgenin iniş güvenliği ve enlemine göre
                        ayarlanıyor — yüksek rakımlı alanlar daha düşük basınç. Brief etkisi: görev uyum skoru
                        ve dayanıklılık basınç yönetim kapasitesini artırıyor. Yüksek görev uyumu = daha iyi basınç
                        kontrol ekipmanı planlanmış demektir.
                    </p>
                </article>
                <article className="summary-note-card">
                    <strong>Toz durumu</strong>
                    <p>
                        Mars'ta global toz fırtınaları oluyor — 2018'de Opportunity aracını öldüren şey tam olarak bu.
                        Toz olasılığı: bölgenin toz riski, krater yoğunluğu ve güneş veriminden hesaplanıyor.
                        Brief etkisi: yüksek otonomi ve sürdürülebilirlik skoru toz baskısını "düşürüyor" —
                        çünkü daha otonom bir sistem panel temizleme robotları ve yedek enerji ile toza daha iyi
                        dayanır.
                    </p>
                </article>
                <article className="summary-note-card">
                    <strong>Neden brief çevresel değerleri etkiliyor?</strong>
                    <p>
                        Fiziksel Mars ortamı değişmez — ama insanın o ortamla başa çıkma kapasitesi değişir!
                        60 kişilik nükleer enerjili bir koloni ile 12 kişilik güneş enerjili bir araştırma üssü
                        aynı bölgede bile tamamen farklı "efektif sıcaklık" yaşar. Bu yüzden çevresel değerler
                        "ham doğa" değil, "görev kapasitesiyle düzeltilmiş operasyonel koşullar" olarak sunuluyor.
                    </p>
                </article>
            </Panel>

            {/* ── Brief Etki ── */}
            <Panel>
                <SectionHeader
                    etiket="Brief etkisi"
                    baslik="4 etki metriği — neyi ölçüyor, neden önemli?"
                    aciklama="Görev brief'inde yapılan seçimlerin operasyonel etkilerini gösteren metrikler."
                />
                <article className="summary-note-card">
                    <strong>Enerji dayanımı — "Enerji hattımız ne kadar sağlam?"</strong>
                    <p>
                        Nükleer tercih etmişsen 90/100'den başlar çünkü nükleer toz fırtınasından etkilenmez.
                        Güneş tercih etmişsen 68/100'den başlar çünkü Mars'ta güneş panelleri toz altında kalıyor.
                        Görev süresi arttıkça azalır çünkü daha uzun görev = daha fazla yıpranma. Korunaklı
                        risk profili +6 bonus verir çünkü daha fazla yedek enerji planlanmış demektir.
                    </p>
                </article>
                <article className="summary-note-card">
                    <strong>İkmal bağımlılığı — "Dünya'dan ne kadar bağımlıyız?"</strong>
                    <p>
                        Geri kazanım odaklı su stratejisi 54/100'den başlar (daha az bağımlı ve bu kötü).
                        Buz çıkarımı 40/100'den başlar ama buz çıkarma altyapısı gerektirir.
                        Üretim odaklı görev amacı +10 ceza alır çünkü üretim daha fazla hammadde demektir.
                        Ekip büyüdükçe bağımlılık artar çünkü daha fazla yiyecek, su, parça gerekir.
                    </p>
                </article>
                <article className="summary-note-card">
                    <strong>Bakım yükü — "Ne kadar tamir işi var?"</strong>
                    <p>
                        28 puandan başlar + ekip büyüklüğü / 5 + görev süresi / 12. Daha fazla insan = daha fazla
                        sistem = daha fazla bakım. Güneş enerjisi +8 bakım cezası çünkü paneller toz temizliği
                        istiyor. Nükleer +5 çünkü nükleer de bakım ister ama daha az.
                    </p>
                </article>
                <article className="summary-note-card">
                    <strong>Genişleme hazırlığı — "Büyümeye hazır mıyız?"</strong>
                    <p>
                        Üretim öncülü görevler 86/100'den başlar — zaten büyümek için gidiyoruz.
                        Araştırma üssü 62/100'den başlar — büyüme ikinci planda. 72+ ay görev süresi
                        +8 bonus çünkü uzun görev daha fazla altyapı kurmamıza izin verir.
                        Agresif risk profili +8 bonus çünkü daha hızlı büyümeye göze alıyoruz.
                    </p>
                </article>
            </Panel>

            {/* ── Kaynak Skorları ── */}
            <Panel>
                <SectionHeader
                    etiket="Kaynak metrikleri"
                    baslik="Backend kaynak skorları — ne anlama geliyor?"
                    aciklama="Plan motorundan gelen 4 kaynak metriğinin anlamı."
                />
                <DataTable
                    columns={["Metrik", "Ne ölçüyor?", "Neden önemli?"]}
                    rows={[
                        [
                            "Güç rezervi (resilience)",
                            "Enerji hattının yedekliliği ve tampon kapasitesi. Bir güneş paneli grubunu kaybetsek sistem çalışmaya devam eder mi?",
                            "Mars'ta tamir ekibi yok. Bir şey bozulursa yedek olmalı. Bu skor ne kadar yedekliliğimiz olduğunu gösteriyor."
                        ],
                        [
                            "Su erişimi (resource_access)",
                            "Buz çıkarım kapasitesi, su geri kazanım verimi ve su lojistiğinin birleşik kalitesi.",
                            "Su = hayat. İçme suyu, oksijen üretimi, yakıt üretimi, bitki yetiştirme... Hepsi suya bağlı."
                        ],
                        [
                            "Otonomi (autonomy)",
                            "Koloninin Dünya'dan bağımsız çalışabilme seviyesi. Yerel üretim + robotik bakım + kaynak döngüsü.",
                            "Mars'a bir kargo göndermek 6-9 ay sürüyor. Acil ihtiyaçta Dünya'dan yardım bekleyemezsiniz."
                        ],
                        [
                            "Survival confidence",
                            "Tüm parametrelerin birleşiminden hesaplanan genel hayatta kalma güveni.",
                            "Tek bir sayıda 'bu görev ne kadar güvenli' sorusunun cevabı. Jüri ve karar vericiler için en kritik metrik."
                        ]
                    ]}
                />
            </Panel>

            {/* ── Kaynak baskı tablosu ── */}
            <Panel>
                <SectionHeader
                    etiket="Stres testi"
                    baslik="Kaynak baskısı tablosu — neden 2 sütun var?"
                    aciklama="Normal koşullar ve fırtına senaryosunda sistemlerin nasıl tepki verdiği."
                />
                <article className="summary-note-card">
                    <strong>Neden normal ve fırtına ayrımı?</strong>
                    <p>
                        Mars'ta her şey plana göre giderse güzel — ama gerçek hayat böyle değil.
                        Global toz fırtınaları güneş panellerini karartıyor, radyasyon fırtınaları ekibi
                        sığınaklara sokuyor, ekipman arızaları oluyor. Bu tablo "en iyi günde" ve "en kötü
                        günde" sistemlerin nasıl tepki vereceğini gösteriyor.
                    </p>
                </article>
                <DataTable
                    columns={["Sistem", "Normal — ne olur?", "Fırtına — ne olur?"]}
                    rows={[
                        [
                            "Güç",
                            "Kaynak erişim skoru/7 kadar fazla üretim tamponu var.",
                            "Risk indeksi/7 kadar güç kaybı yaşanır — yedek devreye girmeli."
                        ],
                        [
                            "Su",
                            "Buz erişimi/8 kadar fazla su üretimi tamponu var.",
                            "Sürdürülebilirlik/14 kadar geri kazanım kapasitesi devrede."
                        ],
                        [
                            "Bakım",
                            "Risk/9 oranında planlı bakım yükü var.",
                            "(100−dayanıklılık)/6 oranında acil bakım ihtiyacı doğar."
                        ]
                    ]}
                />
            </Panel>

            {/* ── Güçlü yönler / kırmızı bayraklar ── */}
            <Panel>
                <SectionHeader
                    etiket="Uyarı sistemi"
                    baslik="Kırmızı bayraklar ve güçlü yönler — neye göre çıkıyor?"
                    aciklama="Sistem hangi durumlarda uyarı veriyor, hangi durumlarda 'güçlü' diyor?"
                />
                <article className="summary-note-card">
                    <strong>Mantık basit: eşik değerleri</strong>
                    <p>
                        Sistem her metriğe bakıyor ve belirli bir eşiğin üstünde veya altındaysa uyarı veya
                        övgü üretiyor. Bu eşikler NASA DRA 5.0 ve Mars görev simülasyonlarından türetilmiştir.
                    </p>
                </article>
                <DataTable
                    columns={["Kontrol", "Eşik", "Ne oluyor?"]}
                    rows={[
                        ["Risk indeksi ≥ 60", "60/100", "KIRMIZI BAYRAK — radyasyon kalkanı ve yedeklilik planı erken faza alınmalı"],
                        ["Toz riski ≥ 65", "65/100", "KIRMIZI BAYRAK — panel bakımı ve filtreleme hatları güçlendirilmeli"],
                        ["Radyasyon ≥ 60", "60/100", "KIRMIZI BAYRAK — regolit koruması Faz I içinde planlanmalı"],
                        ["Otonomi < 55", "55/100", "KIRMIZI BAYRAK — Dünya'ya çok bağımlıyız, ISRU önceliklendirilmeli"],
                        ["Dayanıklılık < 55", "55/100", "KIRMIZI BAYRAK — enerji ve bakım yedekliliği yetersiz"],
                        ["Uygunluk ≥ 70", "70/100", "GÜÇLÜ YÖN — saha görev brief'i ile uyumlu"],
                        ["Lojistik ≥ 65", "65/100", "GÜÇLÜ YÖN — kurulum akışı güvenli"],
                        ["Otonomi ≥ 65", "65/100", "GÜÇLÜ YÖN — yerel üretim kapasitesi yeterli"],
                        ["Sürdürülebilirlik ≥ 60", "60/100", "GÜÇLÜ YÖN — uzun vadeli operasyon mümkün"]
                    ]}
                />
            </Panel>

            {/* ── Bölge parametreleri ── */}
            <Panel>
                <SectionHeader
                    etiket="Ham veri"
                    baslik="Bölge kataloğundaki 11 parametre — neyi temsil ediyor?"
                    aciklama="Backend'den gelen Mars bölgesi fiziksel parametreleri ve gerçek dünya karşılıkları."
                />
                <DataTable
                    columns={["Parametre", "Gerçek dünya anlamı", "Nasıl ölçülüyor?"]}
                    rows={[
                        ["slope (eğim)", "Yüzeyin ne kadar eğimli olduğu. Düşük = güvenli iniş ve kolay inşaat.", "MRO/HiRISE uydu görüntülerinden hesaplanıyor."],
                        ["roughness (pürüzlülük)", "Yüzeyin ne kadar engebeli olduğu. Düşük = araç ve ekipman taşımak kolay.", "HiRISE yüksek çözünürlüklü fotoğraflardan analiz."],
                        ["crater_density", "Birim alandaki krater sayısı. Yüksek = iniş tehlikeli, inşaat zor.", "Mars Global Surveyor + MRO verileri."],
                        ["radiation_estimate", "Yüzeydeki tahmini radyasyon seviyesi. Yüksek = yer altı habitat şart.", "NASA SRAG galaktik kozmik ışın modeli + Mars Odyssey ölçümleri."],
                        ["dust_risk", "Toz fırtınası olasılığı. Yüksek = güneş panelleri risk altında.", "Geçmiş Mars fırtına verileri + iklim modelleri."],
                        ["ice_probability", "Yüzey altında buz bulunma olasılığı. Yüksek = su çıkarımı mümkün.", "Mars Odyssey THEMIS termal ataleti haritası + NASA Water on Mars."],
                        ["thermal_range", "Gündüz-gece sıcaklık farkı (°C). Yüksek = malzeme yorulması riski.", "NASA Mars Facts + bölgesel iklim modeli."],
                        ["solar_efficiency", "Güneş panellerinin bu bölgedeki verim yüzdesi.", "Enlem, atmosfer kalınlığı ve toz modeline göre hesaplama."],
                        ["landing_safety", "İniş güvenliği skoru. Eğim, pürüzlülük ve krater yoğunluğundan türetilir.", "MRO/HiRISE + MOLA topoğrafya haritası."],
                        ["expansion_area", "Genişleme için uygun düz alan miktarı.", "Topoğrafik analiz — düz arazi oranı."],
                        ["construction_feasibility", "İnşa kolaylığı. Zemin stabilitesi ve regolit kalitesine bağlı.", "Yüzey stabilitesi analizi + regolit modeli."]
                    ]}
                />
            </Panel>

            {/* ── Son notlar ── */}
            <Panel>
                <SectionHeader
                    etiket="Sonuç"
                    baslik="Önemli açıklamalar"
                    aciklama=""
                />
                <ul className="detail-list">
                    <li>
                        <strong>Bu gerçek zamanlı ölçüm değil.</strong> Tüm veriler NASA yayınlanmış verilerine
                        dayanan modelleme ve simülasyon sonuçlarıdır. Mars'tan canlı veri çekmiyoruz.
                    </li>
                    <li>
                        <strong>Mağara garantisi yok.</strong> NASA cave/skylight bulgularından esinlendik ama
                        hiçbir sahada "garanti mağara var" demedik. Varsayılan çözüm: kazılmış tünel ve gömülü modül.
                    </li>
                    <li>
                        <strong>Her brief farklı sonuç üretir.</strong> Aynı bölge bile farklı görev parametreleriyle
                        farklı skorlar veriyor. Bu tasarım gereği böyle — karar verici aracı bu.
                    </li>
                    <li>
                        <strong>ScoreCard backend'den geliyor.</strong> Plan motoru görev brief'ini (ekip, süre, enerji, risk)
                        alıp resilience, autonomy, sustainability, mission_fit ve survival_confidence üretiyor.
                        Bu skorlar bölge verisiyle harmanlanarak final çıktıyı oluşturuyor.
                    </li>
                    <li>
                        <strong>Referans mimari: NASA DRA 5.0.</strong> Ekip büyüklüğü aralığı, görev süresi
                        seçenekleri ve habitat tipi kararları bu belgeyle uyumlu tutulmuştur.
                    </li>
                </ul>
            </Panel>
        </div>
    );
}
