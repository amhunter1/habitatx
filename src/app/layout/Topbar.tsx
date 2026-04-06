import { navigationItems } from "../../data/navigation";
import type { Region, ViewId } from "../../types/mission";

export function Topbar({
  seciliBolge,
  ekipBuyuklugu,
  gorevSuresi,
  aktifGorunum
}: {
  seciliBolge: Region;
  ekipBuyuklugu: number;
  gorevSuresi: number;
  aktifGorunum: ViewId;
}) {
  const aktifAdim = navigationItems.findIndex((item) => item.id === aktifGorunum) + 1;

  return (
    <header className="topbar">
      <div className="topbar-copy">
        <p className="eyebrow">Operasyon kokpiti</p>
        <h2>Otonom Mars habitat planlama arayüzü</h2>
        <p className="topbar-description">
          Aktif saha ve görev parametreleri sabit kalır; detay panelleri yalnızca ihtiyaç
          olduğunda açılır.
        </p>
      </div>

      <div className="topbar-region-card">
        <div>
          <p className="eyebrow">Aktif bölge</p>
          <h3>
            {seciliBolge.ad} <span>/ {seciliBolge.sektor}</span>
          </h3>
          <p>{seciliBolge.tanim}</p>
        </div>
        <div className="topbar-summary">
          <span>{aktifAdim}. aşama</span>
          <span>{ekipBuyuklugu} kişilik ekip</span>
          <span>{gorevSuresi} aylık görev</span>
        </div>
      </div>
    </header>
  );
}
