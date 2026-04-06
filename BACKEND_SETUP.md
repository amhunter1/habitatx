# HabitatX Calistirma Notu

## Frontend

1. Koke `.env` ac ve su degiskeni ekle:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

2. Frontend'i calistir:

```powershell
npm install
npm run dev
```

Varsayilan arayuz adresi:

```text
http://localhost:3000
```

## Backend

1. `backend/.env` dosyasi olustur:

```env
HABITATX_APP_ENV=development
HABITATX_DATABASE_URL=sqlite:///./habitatx.db
HABITATX_CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

2. Python ortamini hazirla ve backend bagimliliklarini kur:

```powershell
cd backend
pip install -r requirements.txt
```

3. API'yi baslat:

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Saglik kontrolu:

```text
http://127.0.0.1:8000/health
```

## Ana Endpointler

- `GET /regions`
- `POST /planning-sessions`
- `PATCH /planning-sessions/{id}/quickstart`
- `PATCH /planning-sessions/{id}/mission-brief`
- `POST /planning-sessions/{id}/analyze-region`
- `POST /planning-sessions/{id}/generate-plan`
- `POST /planning-sessions/{id}/generate-scenarios`
- `POST /planning-sessions/{id}/generate-report`
- `GET /planning-sessions/{id}`

## Notlar

- Frontend acildiginda otomatik yeni session olusturur.
- Quickstart degistiginde backend yeniden analiz, plan, senaryo ve rapor uretir.
- Test dosyalari `backend/tests/` altinda hazir, ancak bu ortamda runtime dogrulama yapilamadi.
