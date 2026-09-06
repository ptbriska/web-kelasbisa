/**
 * GEODATIS — MAIN HOME & SHARED ENGINE ROUTER
 * Handles automatic subnav HTML injection and dynamic active link highlighting.
 */

document.addEventListener("DOMContentLoaded", function () {
  initGeodatisMain();
});

function initGeodatisMain() {
  injectGeodatisSubnav();
}

/**
 * Menyuntikkan struktur HTML Subnav GEODATIS ke container #geodatis-subnav-app
 * secara otomatis dengan penyesuaian path relatif (root vs subfolder).
 */
function injectGeodatisSubnav() {
  const container = document.getElementById("geodatis-subnav-app");
  if (!container) return;

  // Cek apakah lokasi halaman saat ini berada di dalam subfolder (02-08)
  const isSubfolder = /\/(0[2-8]-[^\/]+)\//.test(window.location.pathname);
  const basePath = isSubfolder ? "../" : "./";

  const subnavHTML = `
    <nav class="geodatis-subnav-bar">
      <div class="geodatis-container subnav-container">
        <a href="${basePath}index.html" class="subnav-brand">
          <span class="brand-text">GEODATIS</span>
          <span class="brand-badge">Geospatial Data & Statistics</span>
        </a>
        <ul class="subnav-menu">
          <li><a href="${basePath}index.html" id="nav-home">Beranda</a></li>
          <li><a href="${basePath}02-tentang/index.html" id="nav-tentang">Tentang</a></li>
          <li><a href="${basePath}03-program-reguler/index.html" id="nav-reguler">Program Reguler</a></li>
          <li><a href="${basePath}04-program-mitra/index.html" id="nav-mitra">Program Mitra</a></li>
          <li><a href="${basePath}05-program-khusus/index.html" id="nav-khusus">Program Khusus</a></li>
          <li><a href="${basePath}06-portofolio/index.html" id="nav-portofolio">Portofolio</a></li>
          <li><a href="${basePath}07-tentor/index.html" id="nav-tentor">Tentor</a></li>
          <li><a href="${basePath}08-bank-data/index.html" id="nav-bankdata">Bank Data</a></li>
        </ul>
      </div>
    </nav>
  `;

  container.innerHTML = subnavHTML;
  highlightActiveSubnav();
}

/**
 * Otomatis mendeteksi halaman yang sedang dibuka
 * dan memberikan class .active pada link sub-header internal GEODATIS.
 */
function highlightActiveSubnav() {
  const currentPath = window.location.pathname;

  // Pemetaan ID nav berdasarkan fragmen folder di URL
  const navMap = [
    { key: "/02-tentang/", id: "nav-tentang" },
    { key: "/03-program-reguler/", id: "nav-reguler" },
    { key: "/04-program-mitra/", id: "nav-mitra" },
    { key: "/05-program-khusus/", id: "nav-khusus" },
    { key: "/06-portofolio/", id: "nav-portofolio" },
    { key: "/07-tentor/", id: "nav-tentor" },
    { key: "/08-bank-data/", id: "nav-bankdata" }
  ];

  // Bersihkan semua class active terlebih dahulu
  document.querySelectorAll(".subnav-menu a").forEach(a => a.classList.remove("active"));

  // Cari match path atau fallback ke Beranda (nav-home)
  const activeItem = navMap.find(item => currentPath.includes(item.key));
  const activeId = activeItem ? activeItem.id : "nav-home";

  const targetLink = document.getElementById(activeId);
  if (targetLink) {
    targetLink.classList.add("active");
  }
}
