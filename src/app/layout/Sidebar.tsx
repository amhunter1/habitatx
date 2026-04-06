import { navigationItems } from "../../data/navigation";
import type { ViewId } from "../../types/mission";

export function Sidebar({
  aktifGorunum,
  onNavigate
}: {
  aktifGorunum: ViewId;
  onNavigate: (view: ViewId) => void;
}) {
  const aktifIndex = navigationItems.findIndex((item) => item.id === aktifGorunum);

  return (
    <aside className="sidebar">
      <div className="brand-block">
        <div className="brand-mark">HX</div>
        <div>
          <h1>HabitatX</h1>
        </div>
      </div>

      <nav className="nav-list" aria-label="Ana menü">
        {navigationItems.map((item, index) => {
          const durum =
            index < aktifIndex ? "completed" : index === aktifIndex ? "active" : "pending";

          return (
            <button
              key={item.id}
              className={`nav-item ${durum}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="nav-step-index">{index + 1}</span>
              <span className="nav-step-rail" aria-hidden="true">
                <span className="nav-step-progress" />
              </span>
              <span className="nav-copy">
                <span>{item.kategori}</span>
                <strong>{item.baslik}</strong>
              </span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-card sidebar-progress-card">
        <p className="eyebrow">Görev akışı</p>
        <h3>{aktifIndex + 1}. aşama aktif</h3>
        <p>
          Adımlar numaralı ilerleme çizgisi ile bağlı. İstediğinde sonraki ekranlara geçebilir,
          ama sistem temel verileri önceki kararlardan türetmeye devam eder.
        </p>
      </div>
    </aside>
  );
}
