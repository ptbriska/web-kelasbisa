/**
 * ARPA MODULE — TENTANG PAGE ENGINE
 * Fetches info.json and renders dynamic brand identity, target segments, learning framework, and special programs.
 */

let masterTentangData = null;

document.addEventListener("DOMContentLoaded", function () {
  initTentangPage();
});

async function initTentangPage() {
  masterTentangData = await fetchInfoJson();
  if (!masterTentangData) return;

  renderBrandIdentity(masterTentangData.brand_identity);
  renderTargetPengguna(masterTentangData.target_pengguna);
  renderEkosistemRiset(masterTentangData.learning_system_meta, masterTentangData.ekosistem_riset);
  renderProgramSpesial(masterTentangData.program_spesial);
}

// FETCH DATA FROM INFO.JSON
async function fetchInfoJson() {
  try {
    let res = await fetch('info.json');
    if (!res.ok) {
      res = await fetch('./info.json');
    }
    if (!res.ok) throw new Error("Gagal mengambil info.json");
    return await res.json();
  } catch (err) {
    console.error("ARPA Tentang Fetch Error:", err.message);
    return null;
  }
}

// 1. RENDER BRAND IDENTITY
function renderBrandIdentity(brand) {
  if (!brand) return;
  if (brand.kepanjangan) document.getElementById('brandKepanjangan').innerText = brand.kepanjangan;
  if (brand.tagline) document.getElementById('brandTagline').innerText = brand.tagline;
  if (brand.deskripsi) document.getElementById('brandDeskripsi').innerText = brand.deskripsi;
  if (brand.ecosystem_tagline) document.getElementById('ecosystemTagline').innerText = brand.ecosystem_tagline;
  if (brand.powered_by) document.getElementById('poweredBy').innerText = `Powered by ${brand.powered_by}`;
}

// 2. RENDER TARGET PENGGUNA
function renderTargetPengguna(targets) {
  const container = document.getElementById('targetContainer');
  if (!container || !targets || !Array.isArray(targets)) return;

  container.innerHTML = targets.map(t => `
    <div class="target-card">
      <div class="target-icon">${t.icon}</div>
      <h3>${t.kategori}</h3>
      <div class="target-label">Fokus Kebutuhan:</div>
      <ul class="target-list">
        ${t.fokus_kebutuhan.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

// 3. RENDER EKOSISTEM RISET (PBCC, PBLS, SKA-IAM)
function renderEkosistemRiset(meta, ekosistem) {
  if (meta) {
    if (meta.framework_name) document.getElementById('frameworkName').innerText = meta.framework_name;
    if (meta.headline) document.getElementById('learningHeadline').innerText = meta.headline;
    if (meta.sub_headline) document.getElementById('learningSub').innerText = meta.sub_headline;
    if (meta.motto) document.getElementById('learningMotto').innerText = meta.motto;
  }

  const container = document.getElementById('ekosistemContainer');
  if (!container || !ekosistem || !Array.isArray(ekosistem)) return;

  container.innerHTML = ekosistem.map(e => `
    <div class="ekosistem-card">
      <span class="eko-kode">${e.kode}</span>
      <h3>${e.nama}</h3>
      <div class="eko-peran">${e.peran}</div>
      <ul class="eko-list">
        ${e.item_fokus.map(f => `<li>${f}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

// 4. RENDER PROGRAM SPESIAL (NALAR & SINTERA)
function renderProgramSpesial(programs) {
  const container = document.getElementById('specialContainer');
  if (!container || !programs || !Array.isArray(programs)) return;

  container.innerHTML = programs.map(p => `
    <div class="special-card">
      <div class="special-badge">${p.tipe}</div>
      <h3>${p.kode}</h3>
      <p class="special-sub">${p.nama}</p>
      <p class="special-desc">${p.deskripsi}</p>
      <div class="special-freq">📅 <strong>Frekuensi:</strong> ${p.frekuensi}</div>
    </div>
  `).join('');
}
