/**
 * GEODATIS — MODULE 03 PROGRAM REGULER ENGINE
 * Domino Stack Cards, Dynamic Renderers for 3 Independent Data Sections, and Lightbox Preview Modal.
 */

let masterRegulerData = null;

document.addEventListener("DOMContentLoaded", function () {
  initRegulerModule();
});

async function initRegulerModule() {
  masterRegulerData = await fetchRegulerData();
  if (!masterRegulerData) return;

  renderPageMeta(masterRegulerData.page_meta);
  renderDominoPosters(masterRegulerData.rangkuman_poster);
  renderDaftarProgram(masterRegulerData.daftar_program);
  renderRangkumanFasilitas(masterRegulerData.rangkuman_fasilitas);
}

// FETCH DATA DENGAN RELATIVE PATH FALLBACK
async function fetchRegulerData() {
  try {
    let res = await fetch('program-reguler.json');
    if (!res.ok) {
      res = await fetch('./program-reguler.json');
    }
    if (!res.ok) throw new Error("Gagal mengambil program-reguler.json");
    return await res.json();
  } catch (err) {
    console.error("GEODATIS Reguler Data Error:", err.message);
    return null;
  }
}

// 1. RENDER PAGE META & HEADER
function renderPageMeta(meta) {
  if (!meta) return;
  if (meta.title) document.getElementById('pageTitle').innerText = meta.title;
  if (meta.subtitle) document.getElementById('pageSubtitle').innerText = meta.subtitle;
  
  const ctaBtn = document.getElementById('btnKatalogEvent');
  if (ctaBtn && meta.katalog_event_url) {
    ctaBtn.href = meta.katalog_event_url;
  }
}

// 2. RENDER DOMINO STACK CARDS (RANGKUMAN POSTER)
function renderDominoPosters(posters) {
  const container = document.getElementById('dominoPosterStack');
  if (!container || !posters || !Array.isArray(posters)) return;

  container.innerHTML = posters.map(p => `
    <div class="domino-card" onclick="openPosterModal('${p.id}')">
      <img src="${p.file_gambar}" alt="${p.judul_poster}" onerror="this.src='../../assets/images/logo-kelasbisa.png'">
      <div class="domino-overlay">
        <span class="badge-emerald" style="width: fit-content; font-size: 0.7rem;">${p.kategori}</span>
        <h4>${p.judul_poster}</h4>
      </div>
    </div>
  `).join('');
}

// 3. RENDER DAFTAR PROGRAM CARDS (LAYANAN B2C)
function renderDaftarProgram(programs) {
  const container = document.getElementById('daftarProgramContainer');
  if (!container || !programs || !Array.isArray(programs)) return;

  container.innerHTML = programs.map(prog => `
    <div class="katalog-card">
      <div class="card-head-row">
        <span class="badge-dark">${prog.kode}</span>
        <span class="badge-emerald">${prog.format}</span>
      </div>
      <h3 class="prog-title">${prog.nama}</h3>
      <div class="prog-freq">
        📅 <strong>Frekuensi:</strong> ${prog.frekuensi}
      </div>
      <p class="prog-desc">${prog.deskripsi}</p>
    </div>
  `).join('');
}

// 4. RENDER RANGKUMAN FASILITAS & EKOSISTEM
function renderRangkumanFasilitas(fasilitasObj) {
  if (!fasilitasObj) return;

  if (fasilitasObj.judul) document.getElementById('fasilitasJudul').innerText = fasilitasObj.judul;
  if (fasilitasObj.deskripsi) document.getElementById('fasilitasSub').innerText = fasilitasObj.deskripsi;

  const container = document.getElementById('rangkumanFasilitasContainer');
  if (!container || !fasilitasObj.list_fasilitas) return;

  container.innerHTML = fasilitasObj.list_fasilitas.map(f => `
    <div class="fasilitas-card">
      <div class="fasilitas-icon">✓</div>
      <div class="fasilitas-body">
        <h4>${f.kategori}</h4>
        <p>${f.detail}</p>
      </div>
    </div>
  `).join('');
}

// 5. LIGHTBOX / MODAL POPUP LOGIC (PURE PREVIEW)
function openPosterModal(posterId) {
  if (!masterRegulerData || !masterRegulerData.rangkuman_poster) return;

  const poster = masterRegulerData.rangkuman_poster.find(p => p.id === posterId);
  if (!poster) return;

  document.getElementById('modalPosterImg').src = poster.file_gambar;
  document.getElementById('modalPosterTitle').innerText = poster.judul_poster;
  document.getElementById('modalPosterCat').innerText = poster.kategori;
  document.getElementById('modalPosterCaption').innerText = poster.caption;

  const modal = document.getElementById('posterModal');
  if (modal) modal.classList.add('active');
}

function closePosterModal(e) {
  if (e.target.id === 'posterModal') {
    document.getElementById('posterModal').classList.remove('active');
  }
}

function forceClosePosterModal() {
  const modal = document.getElementById('posterModal');
  if (modal) modal.classList.remove('active');
}
