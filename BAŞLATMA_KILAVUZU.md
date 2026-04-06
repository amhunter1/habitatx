# HabitatX Başlatma Kılavuzu

HabitatX, Mars kolonileştirme planlaması için geliştirilmiş bir karar destek sistemidir.

## Ön Koşullar
- Node.js 18+
- Python 3.11+

## Kurulum Adımları

### 1. Backend (API)
- `backend/` dizinine gidin.
- `.env` dosyasını `backend/.env.example`'dan oluşturun.
- Gerekli bağımlılıkları yükleyin
  ```bash
  pip install -r requirements.txt
  ```
- Uygulamayı başlatın: `python -m app.main`

### 2. Frontend (UI)
- Proje kök dizininde `.env` dosyasını `.env.example`'dan oluşturun.
- Bağımlılıkları yükleyin:
  ```bash
  npm install
  ```
- Uygulamayı başlatın:
  ```bash
  npm run dev
  ```

### 3. Otomatik Başlatma
Proje kök dizinindeki `start-dev.ps1` dosyasını kullanarak her iki servisi aynı anda başlatabilirsiniz:
```powershell
.\start-dev.ps1
```
