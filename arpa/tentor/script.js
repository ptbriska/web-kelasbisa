/**
 * ARPA MODULE — TENTOR & REVIEWER ENGINE
 * Fetches info.json and renders mentor profiles, academic citation metrics, and research focus badges.
 */

let masterTentorData = null;

document.addEventListener("DOMContentLoaded", function () {
  initTentorPage();
});

async function initTentorPage() {
  masterTentorData = await fetchInfoJson();
  if (!masterTentorData) return;

  renderPageMeta(masterTentorData.page_meta);
  renderTentorGrid(masterTentorData.daftar_tentor);
}

// FETCH DATA FROM LOCAL INFO.JSON
async function fetchInfoJson() {
  try {
    let res = await fetch('info.json');
    if (!res.ok) res = await fetch('./info.json');
    if (!res.ok) throw new Error("Gagal mengambil info.json");
    return await res.json();
  } catch (err) {
    console.error("ARPA Tentor Fetch Error:", err.message);
    return null;
  }
}

// 1. RENDER META & CTA LINK
function renderPageMeta(meta) {
  if (!meta) return;

  if (meta.subtitle) document.getElementById('heroSubtitle').innerText = meta.subtitle;

  const btnWa = document.getElementById('btnWaTentor');
  if (btnWa && meta.wa_consult_url) {
    btnWa.href = meta.wa_consult_url;
  }
}

// 2. RENDER TENTOR GRID WITH SCHOLAR METRICS
function renderTentorGrid(tentorList) {
  const container = document.getElementById('tentorContainer');
  if (!container || !tentorList || !Array.isArray(tentorList)) return;

  container.innerHTML = tentorList.map(t => `
    <div class="tentor-card">
      <div class="tentor-profile-wrapper">
        <img src="${t.foto}" alt="${t.nama}" class="tentor-img" onerror="this.src='../sample-paper.jpg'">
        <div class="tentor-main-info">
          <h3>${t.nama}</h3>
          <p class="tentor-instansi">🏛️ ${t.instansi}</p>
        </div>
      </div>

      <!-- SCHOLAR METRICS BAR -->
      <div class="scholar-metrics-bar">
        <div class="metric-item">
          <span class="metric-val">${t.sitasi}</span>
          <span class="metric-lbl">Kutipan</span>
        </div>
        <div class="metric-item">
          <span class="metric-val">${t.index_h}</span>
          <span class="metric-lbl">indeks-h</span>
        </div>
        <div class="metric-item">
          <span class="metric-val">${t.index_i10}</span>
          <span class="metric-lbl">indeks-i10</span>
        </div>
      </div>

      <!-- BIDANG RISET BADGES -->
      <div class="tentor-research-body">
        <span class="research-lbl">Bidang Riset & Keahlian:</span>
        <div class="research-tags">
          ${(t.bidang_riset || []).map(b => `<span class="tag-badge">${b}</span>`).join('')}
        </div>
      </div>

      <div class="tentor-footer">
        <a href="https://wa.me/6282268118842?text=Halo%20Admin%20ARPA,%20saya%20ingin%20bimbingan%20riset%20dengan%20mentor%20${encodeURIComponent(t.nama)}" target="_blank" rel="noopener" class="btn-select-mentor">
          Pilih Mentor Ini ➔
        </a>
      </div>
    </div>
  `).join('');
}
