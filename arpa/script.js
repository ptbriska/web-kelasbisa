/**
 * ARPA MICROSITE ENGINE — MAIN HOME & ROUTER
 * Handles automatic subnav HTML injection and active link highlighting.
 */

document.addEventListener("DOMContentLoaded", function () {
  initArpaMain();
});

function initArpaMain() {
  injectArpaSubnav();
}

/**
 * Menyuntikkan Subnav ARPA ke container #arpa-subnav-app
 */
function injectArpaSubnav() {
  const container = document.getElementById("arpa-subnav-app");
  if (!container) return;

  const currentPath = window.location.pathname.replace(/\\/g, '/');
  
  // Deteksi apakah sedang di subfolder (tentang, program, kurikulum, portofolio, tentor)
  const isSubfolder = /\/(tentang|program|kurikulum|portofolio|tentor)\//.test(currentPath);
  const basePath = isSubfolder ? "../" : "./";

  const subnavHTML = `
    <nav class="arpa-subnav-bar">
      <div class="arpa-container subnav-container">
        <a href="${basePath}index.html" class="subnav-brand">
          <span class="brand-text">ARPA</span>
          <span class="brand-badge">Research & Publication Assistance</span>
        </a>
        <ul class="subnav-menu">
          <li><a href="${basePath}index.html" id="nav-arpa-home">Beranda</a></li>
          <li><a href="${basePath}tentang/index.html" id="nav-arpa-tentang">Tentang</a></li>
          <li><a href="${basePath}program/index.html" id="nav-arpa-program">Program</a></li>
          <li><a href="${basePath}kurikulum/index.html" id="nav-arpa-kurikulum">Kurikulum</a></li>
          <li><a href="${basePath}portofolio/index.html" id="nav-arpa-portofolio">Portofolio</a></li>
          <li><a href="${basePath}tentor/index.html" id="nav-arpa-tentor">Tentor</a></li>
        </ul>
      </div>
    </nav>
  `;

  container.innerHTML = subnavHTML;
  highlightActiveArpaSubnav();
}

/**
 * Otomatis mendeteksi halaman aktif untuk memberikan class .active
 */
function highlightActiveArpaSubnav() {
  const currentPath = window.location.pathname.replace(/\\/g, '/');

  const navMap = [
    { key: "/tentang/", id: "nav-arpa-tentang" },
    { key: "/program/", id: "nav-arpa-program" },
    { key: "/kurikulum/", id: "nav-arpa-kurikulum" },
    { key: "/portofolio/", id: "nav-arpa-portofolio" },
    { key: "/tentor/", id: "nav-arpa-tentor" }
  ];

  document.querySelectorAll(".subnav-menu a").forEach(a => a.classList.remove("active"));

  const activeItem = navMap.find(item => currentPath.includes(item.key));
  const activeId = activeItem ? activeItem.id : "nav-arpa-home";

  const targetLink = document.getElementById(activeId);
  if (targetLink) {
    targetLink.classList.add("active");
  }
}
