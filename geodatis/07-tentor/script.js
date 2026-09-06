/**
 * GEODATIS — MODULE 07 TENTOR ENGINE
 * Fetcher & Dynamic Renderer for Instructors and Briska Career Portal Integration.
 */

document.addEventListener("DOMContentLoaded", function () {
  initTentorModule();
});

async function initTentorModule() {
  const masterData = await fetchTentorData();
  if (!masterData) return;

  renderMeta(masterData.page_meta);
  renderTentorGrid(masterData.daftar_tentor);
  renderCareerBanner(masterData.pendaftaran_mentor);
}

async function fetchTentorData() {
  try {
    let res = await fetch('tentor.json');
    if (!res.ok) res = await fetch('./tentor.json');
    if (!res.ok) throw new Error("Gagal mengambil tentor.json");
    return await res.json();
  } catch (err) {
    console.error("GEODATIS Tentor Fetch Error:", err.message);
    return null;
  }
}

function renderMeta(meta) {
  if (!meta) return;
  if (meta.title) document.getElementById('pageTitle').innerText = meta.title;
  if (meta.subtitle) document.getElementById('pageSubtitle').innerText = meta.subtitle;
  if (meta.briska_career_url) document.getElementById('btnBriskaCareer').href = meta.briska_career_url;
}

function renderTentorGrid(tentorList) {
  const container = document.getElementById('tentorGridContainer');
  if (!container || !tentorList || !Array.isArray(tentorList)) return;

  container.innerHTML = tentorList.map(t => `
    <div class="tentor-card">
      <div>
        <div class="tentor-head">
          <img src="${t.foto_file}" alt="${t.nama}" class="tentor-avatar" onerror="this.src='../../assets/images/logo-kelasbisa.png'">
          <div class="tentor-info">
            <h3>${t.nama} (${t.panggilan})</h3>
            <p class="tentor-role">${t.peran}</p>
            <p class="tentor-instansi">🏛️ ${t.pendidikan_instansi}</p>
          </div>
        </div>

        <span class="spec-badge">⚡ ${t.badge_spesialisasi}</span>
        <p class="tentor-exp">${t.pengalaman_singkat}</p>
      </div>

      <div class="skills-box">
        <h4>Keahlian & Topik Pengajaran:</h4>
        <ul class="skill-list">
          ${t.keahlian_utama.map(k => `<li>${k}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');
}

function renderCareerBanner(careerObj) {
  if (!careerObj) return;
  if (careerObj.judul) document.getElementById('careerJudul').innerText = careerObj.judul;
  if (careerObj.deskripsi) document.getElementById('careerSub').innerText = careerObj.deskripsi;
}
