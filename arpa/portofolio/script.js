/**
 * ARPA MODULE — PORTOFOLIO PAGE ENGINE
 * Fetches info.json and renders publication statistics, alumni testimonials with research titles, and class documentation.
 */

let masterPortoData = null;

document.addEventListener("DOMContentLoaded", function () {
  initPortofolioPage();
});

async function initPortofolioPage() {
  masterPortoData = await fetchInfoJson();
  if (!masterPortoData) return;

  renderPageMeta(masterPortoData.page_meta);
  renderStatistik(masterPortoData.dashboard_statistik);
  renderAlumni(masterPortoData.alumni_terpilih);
  renderDokumentasi(masterPortoData.dokumentasi_kelas);
}

// FETCH DATA FROM LOCAL INFO.JSON
async function fetchInfoJson() {
  try {
    let res = await fetch('info.json');
    if (!res.ok) res = await fetch('./info.json');
    if (!res.ok) throw new Error("Gagal mengambil info.json");
    return await res.json();
  } catch (err) {
    console.error("ARPA Portofolio Fetch Error:", err.message);
    return null;
  }
}

// 1. RENDER META & CTA LINKS
function renderPageMeta(meta) {
  if (!meta) return;

  if (meta.subtitle) document.getElementById('heroSubtitle').innerText = meta.subtitle;

  const btnExternalPorto = document.getElementById('btnExternalPorto');
  const btnWaConsult = document.getElementById('btnWaConsult');
  const btnCtaPorto = document.getElementById('btnCtaPorto');
  const btnCtaWa = document.getElementById('btnCtaWa');

  if (meta.external_portfolio_url) {
    if (btnExternalPorto) btnExternalPorto.href = meta.external_portfolio_url;
    if (btnCtaPorto) btnCtaPorto.href = meta.external_portfolio_url;
  }

  if (meta.wa_consult_url) {
    if (btnWaConsult) btnWaConsult.href = meta.wa_consult_url;
    if (btnCtaWa) btnCtaWa.href = meta.wa_consult_url;
  }
}

// 2. RENDER DASHBOARD STATISTIK
function renderStatistik(stats) {
  const container = document.getElementById('statsContainer');
  if (!container || !stats || !Array.isArray(stats)) return;

  container.innerHTML = stats.map(s => `
    <div class="stat-card">
      <div class="stat-number">${s.jumlah}+</div>
      <div class="stat-category">${s.kategori}</div>
      <div class="stat-label">${s.label}</div>
    </div>
  `).join('');
}

// 3. RENDER ALUMNI & JUDUL RISET
function renderAlumni(alumniList) {
  const container = document.getElementById('alumniContainer');
  if (!container || !alumniList || !Array.isArray(alumniList)) return;

  container.innerHTML = alumniList.map(a => `
    <div class="alumni-card">
      <div class="alumni-header">
        <img src="${a.foto_alumni}" alt="${a.nama}" class="alumni-img" onerror="this.src='../sample-paper.jpg'">
        <div class="alumni-info">
          <h3>${a.nama}</h3>
          <p class="alumni-instansi">🏛️ ${a.instansi}</p>
          <span class="alumni-program-badge">${a.program}</span>
        </div>
      </div>
      <div class="alumni-body">
        <div class="alumni-paper-title">
          <strong>📑 Judul Riset:</strong>
          <p>"${a.judul_riset}"</p>
        </div>
        <div class="alumni-quote">
          "${a.testimoni}"
        </div>
      </div>
    </div>
  `).join('');
}

// 4. RENDER DOKUMENTASI KELAS
function renderDokumentasi(fotoList) {
  const container = document.getElementById('galleryContainer');
  if (!container || !fotoList || !Array.isArray(fotoList)) return;

  container.innerHTML = fotoList.map(f => `
    <div class="gallery-card">
      <div class="gallery-img-wrapper">
        <img src="${f.file_foto}" alt="${f.judul}" class="gallery-img" onerror="this.src='../sample-paper.jpg'">
      </div>
      <div class="gallery-info">
        <h3>${f.judul}</h3>
        <p>${f.deskripsi}</p>
      </div>
    </div>
  `).join('');
}
