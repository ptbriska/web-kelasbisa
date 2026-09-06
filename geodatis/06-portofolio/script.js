/**
 * GEODATIS — MODULE 06 PORTOFOLIO ENGINE
 * Pure Fetcher for Portofolio & Testimonial Showcase
 */

document.addEventListener("DOMContentLoaded", function () {
  initPortoModule();
});

async function initPortoModule() {
  const masterData = await fetchPortoData();
  if (!masterData) return;

  renderMeta(masterData.page_meta);
  renderPortoGrid(masterData.featured_portofolio);
}

async function fetchPortoData() {
  try {
    let res = await fetch('portofolio.json');
    if (!res.ok) res = await fetch('./portofolio.json');
    if (!res.ok) throw new Error("Gagal mengambil portofolio.json");
    return await res.json();
  } catch (err) {
    console.error("GEODATIS Porto Fetch Error:", err.message);
    return null;
  }
}

function renderMeta(meta) {
  if (!meta) return;
  if (meta.title) document.getElementById('pageTitle').innerText = meta.title;
  if (meta.subtitle) document.getElementById('pageSubtitle').innerText = meta.subtitle;
  if (meta.porto_external_url) document.getElementById('btnPortoExternal').href = meta.porto_external_url;
  if (meta.whatsapp_cta_url) document.getElementById('btnWaPorto').href = meta.whatsapp_cta_url;
}

function renderPortoGrid(items) {
  const container = document.getElementById('portoGridContainer');
  if (!container || !items || !Array.isArray(items)) return;

  container.innerHTML = items.map(item => `
    <div class="porto-card">
      <div class="map-frame">
        <img src="${item.peta_karya}" alt="${item.judul_karya}" onerror="this.src='../../assets/images/logo-kelasbisa.png'">
        <div class="map-title-badge">🗺️ ${item.judul_karya}</div>
      </div>
      <div class="porto-body">
        <div class="user-profile">
          <img src="${item.foto_peserta}" class="user-avatar" alt="${item.nama_peserta}" onerror="this.src='../../assets/images/logo-kelasbisa.png'">
          <div class="user-info">
            <h4>${item.nama_peserta}</h4>
            <p>🏛️ ${item.instansi}</p>
            <span class="prog-badge">${item.program_diikuti}</span>
          </div>
        </div>
        <p class="testi-quote">"${item.testimoni}"</p>
      </div>
    </div>
  `).join('');
}
