/**
 * GEODATIS — MODULE 02 TENTANG ENGINE
 * Handling dynamic JSON fetch, filter tabs, live tool search, and UI state.
 */

let masterTentangData = null;

document.addEventListener("DOMContentLoaded", function () {
  initTentangModule();
});

async function initTentangModule() {
  masterTentangData = await fetchTentangData();
  if (!masterTentangData) return;

  renderBrandHero(masterTentangData.brand);
  renderSistemPembelajaran(masterTentangData.sistem_pembelajaran);
  renderTargetPengguna(masterTentangData.target_pengguna);
  renderDomainKeilmuan(masterTentangData.domain_keilmuan);
  renderKontakLokasi(masterTentangData.kontak_dan_lokasi);

  setupLiveSearch();
}

// FETCH DATA DENGAN RELATIVE PATH SAFE FALLBACK
async function fetchTentangData() {
  try {
    let res = await fetch('tentang.json');
    if (!res.ok) {
      res = await fetch('./tentang.json');
    }
    if (!res.ok) throw new Error("Gagal mengambil data tentang.json");
    return await res.json();
  } catch (err) {
    console.error("GEODATIS Tentang Error:", err.message);
    return null;
  }
}

// 1. RENDER HERO BRANDING
function renderBrandHero(brand) {
  if (!brand) return;
  
  document.getElementById('brandTagline').innerText = `⚡ ${brand.tagline || 'CLARITY FROM COMPLEXITY'}`;
  document.getElementById('brandNama').innerHTML = `${brand.nama || 'GEODATIS'} <span class="accent-dot">.</span>`;
  document.getElementById('brandFokus').innerText = brand.fokus_utama || '';
  document.getElementById('brandDeskripsi').innerText = brand.deskripsi || '';
  document.getElementById('brandEkosistem').innerText = brand.ekosistem || '';
  document.getElementById('brandPowered').innerText = `Powered by ${brand.powered_by || 'Briska Research Center'}`;
}

// 2. RENDER PILAR SISTEM PEMBELAJARAN
function renderSistemPembelajaran(sistem) {
  if (!sistem) return;

  document.getElementById('sistemJudul').innerText = sistem.judul_pendekatan || '';
  document.getElementById('sistemSub').innerText = sistem.deskripsi_pendekatan || '';

  renderPilarCards(sistem.pilar_metode);
}

function renderPilarCards(pilarList, filterType = 'ALL') {
  const container = document.getElementById('pilarContainer');
  if (!container || !pilarList) return;

  const filtered = pilarList.filter(item => {
    if (filterType === 'ALL') return true;
    if (filterType === 'Performance') return item.kode.includes('PB') || item.kode.includes('SKA');
    if (filterType === 'Cognitive') return item.kode.includes('CB') || item.kode.includes('CIAM');
    return true;
  });

  container.innerHTML = filtered.map(item => `
    <div class="pilar-card glass-card" data-kode="${item.kode}">
      <div class="pilar-head">
        <span class="pilar-tag">${item.tipe}</span>
        <span class="pilar-code">${item.kode}</span>
      </div>
      <h3 class="pilar-title">${item.nama}</h3>
      <ul class="pilar-list">
        ${item.fokus.map(f => `<li>${f}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

// FILTER PILAR TABS
function filterPilar(type, btnElement) {
  document.querySelectorAll('#pilarFilterTabs .tab-btn').forEach(b => b.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  if (masterTentangData && masterTentangData.sistem_pembelajaran) {
    renderPilarCards(masterTentangData.sistem_pembelajaran.pilar_metode, type);
  }
}

// 3. RENDER TARGET PENGGUNA
function renderTargetPengguna(target) {
  if (!target) return;

  document.getElementById('targetJudul').innerText = target.sub_judul || '';
  document.getElementById('targetKet').innerText = target.keterangan || '';

  const container = document.getElementById('targetContainer');
  if (container && target.daftar_target) {
    container.innerHTML = target.daftar_target.map((t, idx) => `
      <div class="target-card">
        <div class="target-icon">0${idx + 1}</div>
        <h3 class="target-cat">${t.kategori}</h3>
        <p class="target-desc">${t.deskripsi}</p>
      </div>
    `).join('');
  }
}

// 4. RENDER DOMAIN KEILMUAN & SKILL
function renderDomainKeilmuan(domain) {
  if (!domain) return;

  // Render Domain Ilmu Terapan
  const listEl = document.getElementById('domainIlmuList');
  if (listEl && domain.domain_ilmu_terapan) {
    listEl.innerHTML = domain.domain_ilmu_terapan.map(item => `
      <li class="domain-item">
        <span class="check-icon">✓</span>
        <span>${item}</span>
      </li>
    `).join('');
  }

  // Render Skill Grid
  renderSkillCards(domain.domain_skill_geodatis);
}

function renderSkillCards(skillList) {
  const gridEl = document.getElementById('domainSkillGrid');
  if (!gridEl || !skillList) return;

  gridEl.innerHTML = skillList.map(s => `
    <div class="skill-card">
      <h4 class="skill-cat">${s.kategori}</h4>
      <div class="tool-tags">
        ${s.tools.map(t => `<span class="tool-badge">${t}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

// LIVE SEARCH TOOL SOFTWARE
function setupLiveSearch() {
  const searchInput = document.getElementById('toolSearchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', function (e) {
    const query = e.target.value.toLowerCase().trim();
    if (!masterTentangData || !masterTentangData.domain_keilmuan) return;

    const allSkills = masterTentangData.domain_keilmuan.domain_skill_geodatis;

    if (!query) {
      renderSkillCards(allSkills);
      return;
    }

    const filteredSkills = allSkills.map(group => {
      const matchedTools = group.tools.filter(t => t.toLowerCase().includes(query));
      const categoryMatch = group.kategori.toLowerCase().includes(query);

      if (categoryMatch || matchedTools.length > 0) {
        return {
          kategori: group.kategori,
          tools: group.tools
        };
      }
      return null;
    }).filter(Boolean);

    renderSkillCards(filteredSkills);
  });
}

// 5. RENDER KONTAK DAN LOKASI KANTOR
function renderKontakLokasi(kontak) {
  const container = document.getElementById('kontakCard');
  if (!container || !kontak) return;

  container.innerHTML = `
    <div class="contact-info">
      <span class="badge-emerald">📍 Official Campus & Research Hub</span>
      <h3>Hubungi & Kunjungi GEODATIS</h3>
      <p class="address-text"><strong>Alamat Kantor:</strong> ${kontak.alamat_kantor}</p>
      <p class="meta-text">🕒 <strong>Jam Operasional:</strong> ${kontak.jam_operasional}</p>
      
      <div class="contact-actions">
        <a href="https://wa.me/${kontak.whatsapp_cs.replace(/[^0-9]/g, '')}?text=Halo%20Admin%20GEODATIS,%20saya%20ingin%20bertanya%20mengenai%20program" target="_blank" class="btn-wa-action">
          💬 Chat WhatsApp CS (${kontak.whatsapp_cs})
        </a>
        <a href="${kontak.gmaps_url}" target="_blank" class="btn-maps-action">
          🗺️ Buka di Google Maps
        </a>
      </div>
    </div>
  `;
}
