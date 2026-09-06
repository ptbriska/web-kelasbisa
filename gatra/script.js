// MASTER SCRIPT GATRA ADHIKA

document.addEventListener("DOMContentLoaded", function () {
  // 1. Inject Sub-Header Navigasi Internal GATRA
  injectGatraSubHeader();

  // 2. Router Halaman Dinamis
  if (document.getElementById('gatraBerandaPage')) {
    initBerandaPage();
  } else if (document.getElementById('gatraProgramUnggulanPage')) {
    initProgramUnggulanPage();
  } else if (document.getElementById('gatraProgramRegulerPage')) {
    initProgramRegulerPage();
  } else if (document.getElementById('gatraAlumniPage')) {
    initAlumniPage();
  } else if (document.getElementById('gatraTutorPage')) {
    initTutorPage();
  }
});

// INJECT SUB-HEADER BARIS 2
function injectGatraSubHeader() {
  const container = document.getElementById('gatra-subnav-app');
  if (!container) return;

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  const menuItems = [
    { title: 'Beranda', url: 'index.html' },
    { title: 'Program Unggulan', url: 'program-unggulan.html' },
    { title: 'Program Reguler', url: 'program-reguler.html' },
    { title: 'Testimoni Alumni', url: 'alumni.html' },
    { title: 'Tutor Pengajar', url: 'tutor.html' }
  ];

  let menuHtml = menuItems.map(item => {
    const isActive = (currentPath === item.url) ? 'class="active"' : '';
    return `<li><a href="${item.url}" ${isActive}>${item.title}</a></li>`;
  }).join('');

  container.innerHTML = `
    <nav class="gatra-subnav">
      <div class="gatra-container subnav-wrapper">
        <a href="index.html" class="subnav-brand">
          🏛️ GATRA <span>ADHIKA</span>
        </a>
        <ul class="subnav-menu">
          ${menuHtml}
        </ul>
        <a href="https://wa.me/6282268118842?text=Halo%20Admin%20GATRA,%20saya%20ingin%20konsultasi%20program" target="_blank" class="btn-wa-consult">
          💬 WA Konsultasi
        </a>
      </div>
    </nav>
  `;
}

// FETCH DATA GENERIC
async function fetchGatraData(endpoint) {
  try {
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error(`Gagal membaca ${endpoint}`);
    return await res.json();
  } catch (err) {
    console.error("GATRA Data Error:", err.message);
    return null;
  }
}

/* ==========================================
   HANDLER 1: BERANDA PAGE
   ========================================== */
async function initBerandaPage() {
  // Render Sneakpeek Promo
  const promoData = await fetchGatraData('program-unggulan.json');
  if (promoData) {
    const grid = document.getElementById('indexPromoPreviewGrid');
    if (grid) {
      grid.innerHTML = promoData.map(item => `
        <div class="gatra-card">
          <span class="badge-gold">${item.badge}</span>
          <h3 style="margin: 12px 0 6px 0;">${item.nama}</h3>
          <p style="font-size: 0.85rem; color: var(--gatra-text-muted);">${item.deskripsi}</p>
          <div style="margin: 14px 0;">
            <strong style="font-size: 1.3rem; color: var(--gatra-crimson);">${item.harga_diskon}</strong>
            <span style="text-decoration: line-through; font-size: 0.82rem; color: #94A3B8; margin-left: 6px;">${item.harga_normal}</span>
          </div>
          <a href="https://wa.me/6282268118842?text=Halo%20Admin,%20saya%20tertarik%20dengan%20${encodeURIComponent(item.nama)}" target="_blank" class="btn-gatra-primary" style="width: 100%; box-sizing: border-box;">${item.cta_text} ➔</a>
        </div>
      `).join('');
    }
  }

  // Render Sneakpeek Program Reguler
  const regulerData = await fetchGatraData('program-reguler.json');
  if (regulerData && regulerData.program_akademik) {
    const grid = document.getElementById('indexProgramPreviewGrid');
    if (grid) {
      grid.innerHTML = regulerData.program_akademik.slice(0, 3).map(item => `
        <div class="gatra-card">
          <span class="badge-gold">${item.kategori}</span>
          <h3 style="margin: 10px 0 4px 0;">${item.nama}</h3>
          <p style="font-size: 0.8rem; color: var(--gatra-gold); font-weight: 700; margin-bottom: 12px;">📅 ${item.periode} (${item.total_jam})</p>
          <ul style="font-size: 0.82rem; padding-left: 18px; margin-bottom: 16px; color: var(--gatra-text-muted);">
            ${item.value_utama.slice(0, 3).map(v => `<li>${v}</li>`).join('')}
          </ul>
          <div style="font-weight: 900; font-size: 1.2rem; color: var(--gatra-crimson);">${item.harga_full}</div>
        </div>
      `).join('');
    }
  }

  // Render Testimoni Brief
  const summaryData = await fetchGatraData('alumni/summary.json');
  if (summaryData && summaryData.alumni_highlight_beranda) {
    const grid = document.getElementById('indexAlumniPreviewGrid');
    if (grid) {
      grid.innerHTML = summaryData.alumni_highlight_beranda.map(item => `
        <div class="gatra-card" style="padding: 18px;">
          <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 12px;">
            <img src="${item.foto}" alt="${item.nama}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--gatra-gold);" onerror="this.src='../assets/images/logo-kelasbisa.png'">
            <div>
              <h4 style="margin: 0; font-size: 0.95rem;">${item.nama}</h4>
              <span style="font-size: 0.75rem; color: var(--gatra-crimson); font-weight: 700;">${item.instansi_lulus}</span>
            </div>
          </div>
          <p style="font-size: 0.82rem; font-style: italic; color: var(--gatra-text-muted); margin: 0;">"${item.testimoni}"</p>
        </div>
      `).join('');
    }
  }
}

/* ==========================================
   HANDLER 2: PROGRAM UNGGULAN PAGE
   ========================================== */
async function initProgramUnggulanPage() {
  const data = await fetchGatraData('program-unggulan.json');
  if (!data) return;

  const container = document.getElementById('unggulanCardsGrid');
  if (!container) return;

  container.innerHTML = data.map(item => `
    <div class="gatra-card" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <span class="badge-gold">${item.badge}</span>
        <h3 style="margin: 12px 0 6px 0; color: var(--gatra-dark); font-size: 1.25rem;">${item.nama}</h3>
        <p style="font-size: 0.88rem; color: var(--gatra-text-muted); line-height: 1.5; margin-bottom: 16px;">${item.deskripsi}</p>
        
        <div style="background: var(--gatra-bg); padding: 12px; border-radius: var(--radius-md); margin-bottom: 16px;">
          <div style="font-size: 1.5rem; font-weight: 900; color: var(--gatra-crimson);">${item.harga_diskon}</div>
          <div style="font-size: 0.8rem; color: #94A3B8;">
            <span style="text-decoration: line-through;">${item.harga_normal}</span> • <strong style="color: var(--gatra-gold);">${item.hemat}</strong>
          </div>
          <div style="font-size: 0.75rem; color: var(--gatra-text-muted); margin-top: 4px;">📌 ${item.periode_aktif}</div>
        </div>

        <h4 style="font-size: 0.85rem; margin: 0 0 8px 0; color: var(--gatra-dark);">Fasilitas Lengkap:</h4>
        <ul style="font-size: 0.82rem; padding-left: 18px; line-height: 1.6; margin-bottom: 24px; color: var(--gatra-text-main);">
          ${item.fasilitas.map(f => `<li>${f}</li>`).join('')}
        </ul>
      </div>

      <a href="https://wa.me/6282268118842?text=Halo%20Admin,%20saya%20mau%20ambil%20paket%20${encodeURIComponent(item.nama)}" target="_blank" class="btn-gatra-primary" style="width: 100%; box-sizing: border-box;">
        ${item.cta_text} ➔
      </a>
    </div>
  `).join('');
}

/* ==========================================
   HANDLER 3: PROGRAM REGULER PAGE
   ========================================== */
async function initProgramRegulerPage() {
  const data = await fetchGatraData('program-reguler.json');
  if (!data) return;

  // Render Cards Program Akademik
  const grid = document.getElementById('regulerCardsGrid');
  if (grid && data.program_akademik) {
    grid.innerHTML = data.program_akademik.map(item => `
      <div class="gatra-card" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span class="badge-gold">${item.kategori}</span>
            <span style="font-size: 0.75rem; font-weight: 700; color: var(--gatra-crimson); background: var(--gatra-crimson-soft); padding: 4px 8px; border-radius: 4px;">${item.sesi_produk}</span>
          </div>
          <h3 style="margin: 0 0 4px 0; font-size: 1.3rem;">${item.nama}</h3>
          <p style="font-size: 0.82rem; color: var(--gatra-text-muted); margin: 0 0 14px 0;">📅 ${item.periode} | ⏱️ ${item.durasi} (${item.total_jam})</p>
          
          <div style="background: var(--gatra-bg); padding: 12px; border-radius: var(--radius-md); margin-bottom: 16px;">
            <div style="font-size: 0.8rem; color: var(--gatra-text-muted);">Bayar Full di Awal:</div>
            <div style="font-size: 1.4rem; font-weight: 900; color: var(--gatra-crimson);">${item.harga_full}</div>
            ${item.cicilan ? `
              <div style="margin-top: 6px; padding-top: 6px; border-top: 1px dashed var(--gatra-border); font-size: 0.8rem; color: var(--gatra-text-main);">
                <strong>Skema Cicilan:</strong> ${item.cicilan.skema}<br>
                <span style="color: #94A3B8;">(Total: ${item.cicilan.total} • ${item.cicilan.hemat_full})</span>
              </div>
            ` : '<div style="font-size: 0.78rem; color: #94A3B8; margin-top: 4px;">*Wajib Bayar Full (Tidak ada cicilan)</div>'}
          </div>

          <p style="font-size: 0.8rem; font-weight: 700; margin: 0 0 6px 0; color: var(--gatra-dark);">⏰ Intensitas Kelas:</p>
          <p style="font-size: 0.8rem; color: var(--gatra-text-muted); margin: 0 0 14px 0; line-height: 1.4;">${item.intensitas}</p>

          <p style="font-size: 0.8rem; font-weight: 700; margin: 0 0 6px 0; color: var(--gatra-dark);">💡 Poin Keunggulan:</p>
          <ul style="font-size: 0.8rem; padding-left: 18px; margin: 0 0 20px 0; color: var(--gatra-text-main); line-height: 1.5;">
            ${item.value_utama.map(v => `<li>${v}</li>`).join('')}
          </ul>
        </div>

        <a href="https://wa.me/6282268118842?text=Halo%20Admin,%20saya%20ingin%20daftar%20${encodeURIComponent(item.nama)}" target="_blank" class="btn-gatra-primary" style="width: 100%; box-sizing: border-box;">
          Daftar Batch Ini ➔
        </a>
      </div>
    `).join('');
  }

  // Render Pendaftaran Fee
  const pendaftaranContainer = document.getElementById('pendaftaranFeeContainer');
  if (pendaftaranContainer && data.program_akademik) {
    const items = data.program_akademik.slice(2, 5); // Ambil sampel skema pendaftaran
    pendaftaranContainer.innerHTML = items.map(item => `
      <div style="background: var(--gatra-bg); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--gatra-border);">
        <span style="font-size: 0.75rem; font-weight: 800; color: var(--gatra-gold);">${item.nama}</span>
        <div style="font-size: 1.2rem; font-weight: 900; color: var(--gatra-dark); margin: 4px 0 10px 0;">${item.biaya_pendaftaran_offline.biaya}</div>
        <ul style="font-size: 0.8rem; padding-left: 16px; margin: 0; color: var(--gatra-text-muted);">
          ${item.biaya_pendaftaran_offline.fasilitas_pendaftaran.map(f => `<li>${f}</li>`).join('')}
        </ul>
      </div>
    `).join('');
  }

  // Render Binsik
  const binsikContainer = document.getElementById('binsikPackagesContainer');
  if (binsikContainer && data.program_tambahan_binsik) {
    binsikContainer.innerHTML = data.program_tambahan_binsik.map(b => `
      <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(217, 119, 6, 0.3); padding: 16px; border-radius: var(--radius-md);">
        <h4 style="margin: 0 0 6px 0; color: var(--gatra-gold); font-size: 1.1rem;">${b.nama_paket}</h4>
        <div style="font-size: 1.3rem; font-weight: 900; color: #FFF; margin-bottom: 8px;">${b.harga}</div>
        <p style="font-size: 0.82rem; color: #94A3B8; margin: 0;">${b.keterangan}</p>
      </div>
    `).join('');
  }

  // Render Jadwal Kelas
  const jadwalContainer = document.getElementById('jadwalKelasContainer');
  if (jadwalContainer && data.opsi_waktu_dan_lokasi) {
    jadwalContainer.innerHTML = data.opsi_waktu_dan_lokasi.jadwal_kelas.map(j => `
      <div style="background: #FFF; padding: 14px; border-radius: var(--radius-md); border: 1px solid rgba(153, 27, 27, 0.15);">
        <strong style="color: var(--gatra-crimson); font-size: 0.9rem;">${j.komponen}</strong>
        <div style="font-size: 0.85rem; font-weight: 800; color: var(--gatra-dark); margin: 4px 0;">⏰ ${j.waktu}</div>
        <div style="font-size: 0.78rem; color: var(--gatra-text-muted);">${j.keterangan}</div>
      </div>
    `).join('');
  }
}

/* ==========================================
   HANDLER 4: ALUMNI DASHBOARD & TABLE PAGE
   ========================================== */
let currentAlumniData = [];
let currentPage = 1;
const rowsPerPage = 10;

async function initAlumniPage() {
  const summary = await fetchGatraData('alumni/summary.json');
  if (!summary) return;

  // Render Stat Metrics
  const statsGrid = document.getElementById('alumniStatsGrid');
  if (statsGrid && summary.statistik_global) {
    const s = summary.statistik_global;
    statsGrid.innerHTML = `
      <div style="background: rgba(255,255,255,0.1); padding: 16px; border-radius: var(--radius-md); border-left: 4px solid var(--gatra-gold);">
        <div style="font-size: 0.78rem; color: #94A3B8;">Total Alumni Lolos ASN</div>
        <div style="font-size: 1.6rem; font-weight: 900; color: #FFF;">${s.total_lulus_asn}</div>
      </div>
      <div style="background: rgba(255,255,255,0.1); padding: 16px; border-radius: var(--radius-md); border-left: 4px solid var(--kb-cyan);">
        <div style="font-size: 0.78rem; color: #94A3B8;">Persentase Kelulusan</div>
        <div style="font-size: 1.6rem; font-weight: 900; color: #FFF;">${s.persentase_kelulusan}</div>
      </div>
      <div style="background: rgba(255,255,255,0.1); padding: 16px; border-radius: var(--radius-md); border-left: 4px solid #25D366;">
        <div style="font-size: 0.78rem; color: #94A3B8;">Skor SKD Tertinggi</div>
        <div style="font-size: 1.6rem; font-weight: 900; color: #FFF;">${s.skor_skd_tertinggi}</div>
      </div>
      <div style="background: rgba(255,255,255,0.1); padding: 16px; border-radius: var(--radius-md); border-left: 4px solid var(--gatra-gold);">
        <div style="font-size: 0.78rem; color: #94A3B8;">Alumni Kedinasan/Taruna</div>
        <div style="font-size: 1.6rem; font-weight: 900; color: #FFF;">${s.total_alumni_taruna}</div>
      </div>
    `;
  }

  // Render Tabs Tahun
  const tabsContainer = document.getElementById('tahunFilterTabs');
  if (tabsContainer && summary.tahun_tersedia) {
    tabsContainer.innerHTML = summary.tahun_tersedia.map((year, idx) => `
      <button class="year-tab-btn ${idx === 0 ? 'active' : ''}" data-year="${year}" onclick="loadAlumniYear('${year}', this)" style="padding: 8px 16px; border-radius: var(--radius-md); border: 1px solid var(--gatra-border); background: ${idx === 0 ? 'var(--gatra-crimson)' : '#FFF'}; color: ${idx === 0 ? '#FFF' : 'var(--gatra-dark)'}; font-weight: 700; cursor: pointer;">
        Angkatan ${year}
      </button>
    `).join('');

    // Load Default Year
    loadAlumniYear(summary.tahun_tersedia[0]);
  }

  // Live Search Event
  const searchInput = document.getElementById('alumniSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function (e) {
      const keyword = e.target.value.toLowerCase();
      const filtered = currentAlumniData.filter(item => 
        item.nama.toLowerCase().includes(keyword) ||
        item.instansi_lulus.toLowerCase().includes(keyword) ||
        item.asal_sekolah.toLowerCase().includes(keyword)
      );
      renderAlumniTable(filtered, 1);
    });
  }
}

// FETCH & RENDER DATA ALUMNI PER TAHUN
async function loadAlumniYear(year, btnElement) {
  if (btnElement) {
    document.querySelectorAll('.year-tab-btn').forEach(b => {
      b.style.background = '#FFF';
      b.style.color = 'var(--gatra-dark)';
    });
    btnElement.style.background = 'var(--gatra-crimson)';
    btnElement.style.color = '#FFF';
  }

  const data = await fetchGatraData(`alumni/${year}.json`);
  if (data) {
    currentAlumniData = data;
    renderAlumniTable(currentAlumniData, 1);
  }
}

// RENDER TABLE DINAMIS WITH PAGINATION
function renderAlumniTable(dataList, page = 1) {
  currentPage = page;
  const tbody = document.getElementById('alumniTableBody');
  const info = document.getElementById('paginationInfo');
  const controls = document.getElementById('paginationControls');

  if (!tbody) return;

  if (dataList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 24px; color: var(--gatra-text-muted);">Data alumni tidak ditemukan.</td></tr>`;
    if (info) info.innerText = 'Menampilkan 0 data';
    if (controls) controls.innerHTML = '';
    return;
  }

  const startIdx = (page - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const paginatedData = dataList.slice(startIdx, endIdx);

  tbody.innerHTML = paginatedData.map(item => `
    <tr style="border-bottom: 1px solid var(--gatra-border);">
      <td style="padding: 12px 20px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <img src="${item.foto}" alt="${item.nama}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover;" onerror="this.src='../assets/images/logo-kelasbisa.png'">
          <strong style="color: var(--gatra-dark);">${item.nama}</strong>
        </div>
      </td>
      <td style="padding: 12px 20px;"><span class="badge-gold">${item.jenis_program || 'CPNS/Kedinasan'}</span></td>
      <td style="padding: 12px 20px;">
        <strong style="color: var(--gatra-crimson);">${item.instansi_lulus}</strong><br>
        <small style="color: var(--gatra-text-muted);">${item.formasi}</small>
      </td>
      <td style="padding: 12px 20px; text-align: center; font-weight: 900; color: var(--gatra-dark);">${item.skor_skd}</td>
      <td style="padding: 12px 20px; color: var(--gatra-text-muted);">${item.asal_sekolah}</td>
      <td style="padding: 12px 20px; font-size: 0.8rem; font-style: italic; color: var(--gatra-text-main); max-width: 240px;">"${item.testimoni || '-'}"</td>
    </tr>
  `).join('');

  if (info) {
    info.innerText = `Menampilkan ${startIdx + 1} - ${Math.min(endIdx, dataList.length)} dari ${dataList.length} alumni`;
  }

  // Render Pagination Buttons
  const totalPages = Math.ceil(dataList.length / rowsPerPage);
  if (controls && totalPages > 1) {
    let btns = '';
    for (let i = 1; i <= totalPages; i++) {
      btns += `<button onclick="renderAlumniTable(currentAlumniData, ${i})" style="padding: 4px 10px; border-radius: 4px; border: 1px solid var(--gatra-border); background: ${i === page ? 'var(--gatra-crimson)' : '#FFF'}; color: ${i === page ? '#FFF' : 'var(--gatra-dark)'}; cursor: pointer;">${i}</button>`;
    }
    controls.innerHTML = btns;
  } else if (controls) {
    controls.innerHTML = '';
  }
}

/* ==========================================
   HANDLER 5: TUTOR PAGE
   ========================================== */
async function initTutorPage() {
  const data = await fetchGatraData('tutor.json');
  if (!data) return;

  // Render Tutor Cards
  const grid = document.getElementById('tutorCardsGrid');
  if (grid && data.daftar_tutor) {
    grid.innerHTML = data.daftar_tutor.map(t => `
      <div class="gatra-card" style="text-align: center; padding: 24px 16px;">
        <img src="${t.foto}" alt="${t.nama}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid var(--gatra-gold); margin-bottom: 12px;" onerror="this.src='../assets/images/logo-kelasbisa.png'">
        <h3 style="margin: 0 0 4px 0; font-size: 1.1rem; color: var(--gatra-dark);">${t.nama}</h3>
        <div style="font-size: 0.8rem; font-weight: 800; color: var(--gatra-crimson); margin-bottom: 6px;">${t.role}</div>
        <span class="badge-gold" style="font-size: 0.7rem;">${t.status_kredensial}</span>
        
        <p style="font-size: 0.8rem; font-style: italic; color: var(--gatra-text-muted); margin: 16px 0 12px 0;">"${t.quote}"</p>
        
        <div style="display: flex; flex-wrap: wrap; gap: 4px; justify-content: center;">
          ${t.bidang_keahlian.map(k => `<span style="font-size: 0.7rem; background: var(--gatra-bg); padding: 2px 8px; border-radius: 4px; border: 1px solid var(--gatra-border);">${k}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  // Render Cabang List
  const cabangContainer = document.getElementById('cabangListContainer');
  if (cabangContainer && data.kantor_cabang) {
    cabangContainer.innerHTML = data.kantor_cabang.map(c => `
      <div style="background: var(--gatra-bg); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--gatra-border);">
        <h4 style="margin: 0 0 6px 0; font-size: 1.1rem; color: var(--gatra-dark);">${c.nama_cabang}</h4>
        <p style="font-size: 0.85rem; color: var(--gatra-text-muted); margin: 0 0 12px 0;">📍 ${c.alamat}</p>
        <span class="badge-gold" style="display: inline-block; margin-bottom: 12px;">${c.tipe}</span>
        
        <ul style="font-size: 0.82rem; padding-left: 18px; color: var(--gatra-text-main); margin: 0 0 16px 0;">
          ${c.fasilitas_cabang.map(f => `<li>${f}</li>`).join('')}
        </ul>

        <a href="${c.gmaps_url}" target="_blank" style="font-size: 0.82rem; color: var(--gatra-crimson); font-weight: 800; text-decoration: none;">Buka di Google Maps ➔</a>
      </div>
    `).join('');
  }
}
