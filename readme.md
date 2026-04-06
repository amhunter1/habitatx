# HabitatX

HabitatX, Mars uzerinde kalici yerlesim planlamasi icin tasarlanmis bir karar destek ve simulasyon arayuzudur. Proje; uygun bolge secimi, gorev parametrelerinin tanimlanmasi, saha analizi, habitat plani, alternatif senaryolar ve AI destekli rapor olusturma adimlarini tek bir oturum akisi icinde birlestirir.

Bu depo iki ana parcadan olusur:

- `frontend`: React + TypeScript + Vite ile gelistirilmis kontrol paneli
- `backend`: FastAPI + SQLAlchemy tabanli analiz, planlama ve raporlama servisi

HabitatX'in hedefi yalnizca gorsel bir demo sunmak degil; kullanici girdilerini tutarli bir `planning session` modeli etrafinda toplayip, bu girdilerden tekrar uretilebilir teknik ciktılar elde etmektir.

## Icerik

- [Proje Ozeti](#proje-ozeti)
- [Neler Sunar](#neler-sunar)
- [Kullanici Akisi](#kullanici-akisi)
- [Teknik Mimari](#teknik-mimari)
- [Teknoloji Yigini](#teknoloji-yigini)
- [Klasor Yapisi](#klasor-yapisi)
- [Kurulum](#kurulum)
- [Ortam Degiskenleri](#ortam-degiskenleri)
- [Calistirma Komutlari](#calistirma-komutlari)
- [API Ozeti](#api-ozeti)
- [Domain Mantigi](#domain-mantigi)
- [Test ve Dogrulama](#test-ve-dogrulama)
- [Gelisim Notlari](#gelisim-notlari)
- [Yol Haritasi](#yol-haritasi)

## Proje Ozeti

Mars'ta yasam icin dogru lokasyon secimi; radyasyon, toz, inis guvenligi, buz erisimi, enerji verimi, genisleme alani ve insa edilebilirlik gibi birden fazla metriğin birlikte degerlendirilmesini gerektirir. HabitatX bu problemi asagidaki katmanlara ayirir:

1. Saha secimi
2. Hizli gorev parametreleri
3. Detayli mission brief
4. Analiz motoru
5. Sehir plani ve fazlama
6. Senaryo karsilastirma
7. AI destekli teknik rapor

Bu akisin tamami backend tarafinda session bazli saklanir. Boylece kullanici girdileri ekranlar arasinda kopmaz, yeniden analiz ve plan olusturma deterministik hale gelir, gelecekte export veya sunum entegrasyonlari daha kolay kurulur.

## Neler Sunar

### 1. Etkilesimli Mars saha secimi

- Mars kure modeli uzerinden aday bolgelerin secimi
- Kutuplar ve yuksek enlem koridorlarina odakli saha katalogu
- Her bolge icin ozet arazi ve kaynak karakteristigi

### 2. Mission planning oturumu

- Ekip buyuklugu
- Gorev suresi
- Risk profili
- Gorev amaci
- Enerji stratejisi
- Su stratejisi

### 3. Canli analiz ve yeniden hesaplama

- Secili bolgeye gore uygunluk skoru
- Risk indeksi
- Genisleme skoru
- Lojistik skoru
- Turetilmis saha metrikleri
- Kritik kirmizi bayraklar

### 4. Fazlara bolunmus sehir plani

- Faz I / Faz II / Faz III sehir kurulum akisi
- Modul bazli oneriler
- Kapasite ve enerji yuku yorumlari
- Darbogazlar ve ust seviye tavsiyeler

### 5. Alternatif senaryolar

- Korunakli plan
- Dengeli plan
- Agresif buyume plani

### 6. AI rapor ciktilari

- Executive summary
- Technical summary
- Basliklandirilmis rapor bolumleri
- Sonraki adimlar listesi
- Sunum veya export icin kullanilabilecek yapilandirilmis payload

## Kullanici Akisi

Uygulama arayuzu asagidaki sirada ilerler:

### Ana Merkez

Kullanici secili Mars sahasini, ekip buyuklugunu, gorev suresini ve risk profilini belirler.

### Gorev Konfigurasyonu

Detayli mission brief parametreleri tanimlanir:

- mission purpose
- energy strategy
- water strategy
- kapasite ve otonomi etkileri

### Bolge Analizi

Secili saha icin:

- analiz ozeti
- kaynak metrikleri
- risk ve lojistik yorumlari
- mission input'larina gore etki metrikleri

### Sehir Plani

Backend plan motoru:

- fazlari olusturur
- modulleri secer
- top recommendations listesi uretir
- senaryolari karsilastirilabilir hale getirir

### AI Raporu

Session altinda biriken tum veri; yonetici ozeti, teknik ozet ve sonraki adimlar halinde raporlanir.

## Teknik Mimari

Sistem, tek dogruluk kaynagi olacak sekilde tasarlanmis bir `planning session` modeli etrafinda kurulur.

### Yuksek seviye mimari

```text
Frontend (React/Vite)
  -> /regions
  -> /planning-sessions
  -> /planning-sessions/:id/quickstart
  -> /planning-sessions/:id/mission-brief
  -> /planning-sessions/:id/analyze-region
  -> /planning-sessions/:id/generate-plan
  -> /planning-sessions/:id/generate-scenarios
  -> /planning-sessions/:id/generate-report

Backend (FastAPI)
  -> API routers
  -> domain services
  -> engine katmanlari
  -> SQLAlchemy models / SQLite persistence
```

### Frontend sorumluluklari

- Kullanici deneyimi ve ekran akisi
- Session yasam dongusunu tetikleme
- Backend payload'larini UI modellerine map etme
- Senaryo, metrik ve rapor sonucunu gorsellestirme

### Backend sorumluluklari

- Oturum olusturma ve guncelleme
- Saha katalogu saglama
- Bolge analizi hesaplama
- Plan ve skor karti uretme
- Senaryo varyantlari olusturma
- AI rapor payload'i uretme

## Teknoloji Yigini

### Frontend

- React 18
- TypeScript
- Vite
- Three.js
- `@google/model-viewer`

### Backend

- FastAPI
- SQLAlchemy 2
- Pydantic 2
- Pytest
- SQLite

## Klasor Yapisi

```text
habitatx/
  backend/
    app/
      api/
      domains/
        analysis/
        planning/
        regions/
        reports/
        scenarios/
        scoring/
        sessions/
      config.py
      db.py
      main.py
    tests/
    requirements.txt
    habitatx.db
  marsmodeli/
  src/
    app/
    components/
    data/
    features/
    lib/
    styles/
    types/
  .env.example
  start-dev.ps1
  package.json
  vite.config.ts
```

### Dikkat cekici dosyalar

- `src/app/state/useMissionPlanner.ts`: frontend session orkestrasyonu
- `src/lib/api.ts`: API istemcisi
- `backend/app/main.py`: FastAPI giris noktasi
- `backend/app/api/planning_sessions.py`: temel planning endpoint'leri
- `backend/app/domains/analysis/`: saha analiz motoru
- `backend/app/domains/planning/`: modul ve faz planlama motoru
- `backend/app/domains/reports/`: AI rapor payload olusturma katmani

## Kurulum

### Gereksinimler

- Node.js 18+
- npm 9+
- Python 3.11+
- Windows PowerShell veya benzeri bir terminal

### 1. Depoyu hazirlayin

```powershell
git clone <repo-url>
cd habitatx
```

### 2. Frontend bagimliliklarini kurun

```powershell
cmd /c npm install
```

### 3. Backend bagimliliklarini kurun

```powershell
cd backend
pip install -r requirements.txt
cd ..
```

## Ortam Degiskenleri

### Frontend `.env`

Kok dizinde `.env` dosyasi olusturun:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Varsayilan API tabani `src/lib/api.ts` icinde yine ayni adrese dusmektedir; ancak net ve tasinabilir bir kurulum icin `.env` kullanmaniz onerilir.

### Backend `backend/.env`

```env
HABITATX_APP_ENV=development
HABITATX_DATABASE_URL=sqlite:///./habitatx.db
HABITATX_CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Mevcut backend config anahtarlari

| Anahtar | Aciklama | Varsayilan |
| --- | --- | --- |
| `HABITATX_APP_ENV` | uygulama ortami | `development` |
| `HABITATX_DATABASE_URL` | SQLAlchemy baglanti adresi | `sqlite:///./habitatx.db` |
| `HABITATX_CORS_ORIGINS` | izin verilen origin listesi | `http://localhost:3000,http://127.0.0.1:3000` |

## Calistirma Komutlari

### Backend

```powershell
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Saglik kontrolu:

```text
http://127.0.0.1:8000/health
```

Beklenen cevap:

```json
{
  "status": "ok",
  "environment": "development"
}
```

### Frontend

```powershell
cmd /c npm run dev
```

Varsayilan gelistirme adresi:

```text
http://localhost:3000
```

### Tek komutla ikisini birden

Proje kokunde hazir gelen script:

```powershell
cmd /c npm run dev:all
```

Bu komut:

- backend'i yeni bir PowerShell penceresinde baslatir
- frontend'i mevcut terminalde acik tutar

Alternatif olarak script dogrudan da cagrilabilir:

```powershell
powershell -ExecutionPolicy Bypass -File .\start-dev.ps1
```

### Production benzeri build

```powershell
cmd /c npm run build
```

Not: Bu komutun basarili olmasi icin once `npm install` calistirilmis olmalidir.

## API Ozeti

### 1. Bolge katalogu

#### `GET /regions`

Tum aday bolgeleri listeler.

Ornek alanlar:

- `id`
- `display_name`
- `sector`
- `ice_probability`
- `landing_safety`
- `construction_feasibility`

### 2. Planning session olusturma

#### `POST /planning-sessions`

Yeni bir oturum olusturur.

Ornek istek:

```json
{
  "selected_region_id": "arcadia_planitia",
  "crew_size": 24,
  "mission_duration_months": 48,
  "risk_profile": "dengeli"
}
```

### 3. Quickstart guncelleme

#### `PATCH /planning-sessions/{id}/quickstart`

Ana ekran parametrelerini gunceller:

- secili bolge
- ekip buyuklugu
- gorev suresi
- risk profili

### 4. Mission brief guncelleme

#### `PATCH /planning-sessions/{id}/mission-brief`

Gelismis planlama alanlarini kaydeder:

- `mission_purpose`
- `target_population`
- `energy_strategy`
- `water_strategy`
- `autonomy_level`
- `robot_count`
- `risk_tolerance`
- `growth_target`

### 5. Analiz

#### `POST /planning-sessions/{id}/analyze-region`

Secili bolge icin yorumlanmis analiz uretir.

### 6. Plan

#### `POST /planning-sessions/{id}/generate-plan`

Asagidaki ciktilari uretir:

- `plan`
- `score_card`
- `phases`
- `modules`

### 7. Senaryolar

#### `POST /planning-sessions/{id}/generate-scenarios`

Standart olarak 3 varyant dondurur:

- korunakli
- dengeli
- agresif buyume

### 8. Rapor

#### `POST /planning-sessions/{id}/generate-report`

Executive summary, technical summary ve yapilandirilmis rapor payload'i olusturur.

### 9. Session envelope

#### `GET /planning-sessions/{id}`

Frontend'in tum ekranlarini besleyen birlestirilmis payload'i dondurur:

- session
- quickstart
- mission_brief
- region
- analysis
- plan
- score_card
- scenarios
- report

## Domain Mantigi

### Region seed katalogu

Varsayilan sahalar:

- `planum_boreum`
- `arcadia_planitia`
- `deuteronilus_mensae`

Bu katalog uygulama ayaga kalktiginda veritabani bos ise otomatik seed edilir.

### Analysis engine

Bolge motoru, saha verisinden yorumlu skorlara gider:

- `site_suitability_score`
- `risk_index`
- `expansion_score`
- `logistics_score`

Ayrica:

- `strengths`
- `red_flags`
- `derived_metrics`
- `analysis_summary`

gibi insan tarafindan okunabilir ciktılar da olusturulur.

### Planning engine

Plan motoru mission brief + analiz sonucunu birlestirerek:

- uygun modulleri secer
- modulleri fazlara yerlestirir
- constraint ve bottleneck listesi uretir
- `score_card` hesaplar

Modul katalogunda ornek olarak su yapilar bulunur:

- Yasam Cekirdegi
- Yasam Destegi Yedegi
- ISRU Su Tesisi
- Enerji Omurgasi
- Regolit Kalkan Hatti
- Mobil Bakim Hangari
- Uretim Podu
- Tarim Halkasi

### Scenario engine

Ayni session icin farkli optimizasyon hedefleriyle alternatif plan varyantlari olusturulur.

### Report engine

Rapor katmani; session, mission brief, analysis, plan, score card ve scenario verilerini bir araya getirip yapilandirilmis bir rapor payload'ina donusturur. Bu yapi ileride:

- LLM entegrasyonu
- PDF export
- sunum olusturma
- jurilere yonelik otomatik ozetler

icin iyi bir temel saglar.

## Test ve Dogrulama

### Backend testleri

Bu depoda backend icin Pytest tabanli testler bulunur:

- `backend/tests/test_sessions.py`
- `backend/tests/test_analysis.py`
- `backend/tests/test_planning.py`

Calistirmak icin:

```powershell
cd backend
pytest
```

Kapsanan basliklar:

- session olusturma ve patch akisi
- analiz uretimi ve session status guncellemesi
- plan, senaryo ve rapor olusturma zinciri

### Frontend build dogrulamasi

```powershell
cmd /c npm run build
```

Eger `tsc is not recognized` benzeri bir hata aliyorsaniz, tipik neden frontend bagimliliklarinin henuz yuklenmemis olmasidir. Once `cmd /c npm install` calistirin.

## Gelisim Notlari

### Session tabanli tasarim neden onemli

Bu projenin en guclu yani, veri akisini ekran bazli degil oturum bazli kurgulamasidir. Bu sayede:

- autosave mantigi kurulabilir
- ekranlar arasi veri tutarliligi korunur
- ayni session tekrar yuklenebilir
- gelecek export isleri ayni payload ile calisabilir

### Frontend davranisi

Frontend acilista:

1. bolge listesini ceker
2. varsayilan session olusturur
3. mission brief yazar
4. analiz, plan, senaryo ve rapor endpoint'lerini tetikler
5. donen envelope verisini UI state'e hydrate eder

Kullanici parametreleri degistirdiginde belirli bir debounce sonrasinda ayni zincir yeniden calistirilir.

### Persistence

Varsayilan veritabani SQLite'tir:

- gelistirme icin hizli
- demos ve hackathon akisi icin pratik
- kurulum esigini dusuk tutar

Ihtiyac halinde PostgreSQL'e gecis icin `HABITATX_DATABASE_URL` yeterli bir baslangic noktasi saglar.

## Yol Haritasi

Projeyi bir sonraki seviyeye tasimak icin mantikli gelisim adimlari:

1. Gercek LLM entegrasyonu ile rapor katmanini zenginlestirmek
2. Session gecmisi ve kayitli calisma ekranlari eklemek
3. PDF / PPTX export ciktilari eklemek
4. Gercek bilimsel veri setleriyle region seed katalogunu genisletmek
5. Kimlik dogrulama ve ekip bazli ortak calisma akisi eklemek
6. Asenkron job queue ile agir planlama islerini arka plana almak
7. Gercek zamanli durum guncellemesi icin progress event sistemi kurmak

## Son Not

HabitatX, gorsel olarak etkileyici bir Mars kolonizasyon demosunun otesinde; karar destek mantigi, session bazli veri modeli ve fazli planlama kurgusuyla urunlestirilmeye uygun bir temel ortaya koyar. Bu depo; sunum, demo, teknik prototip ve ileride daha ciddi analiz pipeline'lari icin iyi bir baslangic noktasi sunar.
