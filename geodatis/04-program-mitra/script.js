/**
 * GEODATIS — MODULE 04 PROGRAM MITRA ENGINE
 * Dynamic Renderers for B2B/B2G Services, Partner Logos, Photo Documentation, and WA Direct CTA.
 */

let masterMitraData = null;

document.addEventListener("DOMContentLoaded", function () {
  initMitraModule();
});

async function initMitraModule() {
  masterMitraData = await fetchMitraData();
  if (!masterMitraData) return;

  renderPageMeta(masterMitraData.page_meta);
  renderDaftarProgram(masterMitraData.daftar_program);
  renderMitraLogos(masterMitraData.mitra_kerja_sama);
  renderDokumentasi(masterMitraData.dokumentasi_pelatihan);
}

// FETCH DATA DENGAN RELATIVE PATH FALLBACK
async function fetchMitraData() {
  try {
    let res = await fetch('program-mitra.json');
    if (!res.ok) {
      res = await fetch('./program-mitra.json');
    }
    if (!res.ok) throw new Error("Gagal mengambil program-mitra.json");
    return await res.json();
  } catch (err) {
    console.error("GEODATIS Mitra Data Error:", err.message);
    return null;
  }
}

// 1. RENDER PAGE META & CTA WA LINK
function renderPageMeta(meta) {
  if (!meta) return;
  if (meta.title) document.getElementById('pageTitle').innerText = meta.title;
  if (meta.subtitle) document.getElementById('pageSubtitle').innerText = meta.subtitle;

  const btnWa = document.getElementById('btnWaMitra');
  if (btnWa && meta.whatsapp_cs) {
    const rawNumber = meta.whatsapp_cs.replace(/[^0-9]/g, '');
    btnWa.href = `https://wa.me/62${rawNumber.startsWith('0') ? rawNumber.slice(1) : rawNumber}?text=Halo%20Admin%20GEODATIS,%20saya%20inik%20konsultasi%20mengenai%20Program%20Pelatihan%20Instansi/Project%20Kemitraan`;
  }
}

// 2. RENDER DAFTAR PROGRAM KEMITRAAN (B2B/B2G)
function renderDaftarProgram(programs) {
  const container = document.getElementById('daftarProgramContainer');
  if (!container || !programs || !Array.isArray(programs)) return;

  container.innerHTML = programs.map(p => `
    <div class="mitra-card">
      <div class="card-head-row">
        <span class="badge-dark">${p.kode}</span>
        <span class="badge-emerald">${p.badge}</span>
      </div>
      <h3 class="prog-title">${p.nama}</h3>
      <div class="prog-format">
        🖥️ <strong>Format:</strong> ${p.format}
      </div>
      <p class="prog-desc">${p.deskripsi}</p>
      <ul class="mitra-feature-list">
        ${p.fitur.map(f => `<li>${f}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

// 3. RENDER MITRA LOGO GRID
function renderMitraLogos(logos) {
  const container = document.getElementById('mitraLogoContainer');
  if (!container || !logos || !Array.isArray(logos)) return;

  container.innerHTML = logos.map(l => `
    <div class="logo-card">
      <img src="${l.logo_file}" alt="${l.nama_instansi}" onerror="this.src='../../assets/images/logo-kelasbisa.png'">
      <span>${l.nama_instansi}</span>
    </div>
  `).join('');
}

// 4. RENDER DOKUMENTASI PELATIHAN (GALERI FOTO)
function renderDokumentasi(dokuList) {
  const container = document.getElementById('dokumentasiContainer');
  if (!container || !dokuList || !Array.isArray(dokuList)) return;

  container.innerHTML = dokuList.map(d => `
    <div class="doku-card">
      <div class="doku-img-wrapper">
        <img src="${d.foto_file}" alt="${d.judul_kegiatan}" onerror="this.src='../../assets/images/logo-kelasbisa.png'">
        <span class="doku-tag">${d.kategori}</span>
      </div>
      <div class="doku-info">
        <h4>${d.judul_kegiatan}</h4>
        <p>${d.deskripsi}</p>
      </div>
    </div>
  `).join('');
}
