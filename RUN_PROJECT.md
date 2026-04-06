# HabitatX Calistirma Ozeti

## Backend

```powershell
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Saglik kontrolu:

```text
http://127.0.0.1:8000/health
```

Istersen `backend/.env`:

```env
HABITATX_APP_ENV=development
HABITATX_DATABASE_URL=sqlite:///./habitatx.db
HABITATX_CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## Frontend

Kok dizindeki `.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Calistir:

```powershell
npm install
cmd /c npm run dev
```

Ac:

```text
http://localhost:3000
```

## Tek Komutla Baslatma

Proje kokunden hem backend hem frontend'i birlikte baslat:

```powershell
cmd /c npm run dev:all
```

Bu komut ne yapar:

- backend'i yeni bir PowerShell penceresinde acar
- frontend'i mevcut terminalde baslatir

Script'i dogrudan da calistirabilirsin:

```powershell
powershell -ExecutionPolicy Bypass -File .\start-dev.ps1
```

## Dogru Sira

1. Backend'i baslat.
2. `/health` kontrolunu yap.
3. Frontend'i baslat.
4. `localhost:3000` adresini ac.

## Notlar

- Frontend acildiginda otomatik planning session olusturur.
- Bolge, ekip, sure veya gorev brief'i degisince backend yeniden analiz ve plan uretir.
- `.env` ve `backend/habitatx.db` gibi lokal dosyalari commit'leme.
