// MASTER SCRIPT UNTUK MICRO-SITE POCI

document.addEventListener("DOMContentLoaded", async function () {
  await loadPociMainInfo();
});

// 1. MEMBACA & MENGRENDER DATA INFO UTAMA (info.json)
async function loadPociMainInfo() {
  try {
    const res = await fetch('info.json');
    if (!res.ok) throw new Error("Gagal mengambil data info.json");
    
    const data = await res.json();

    // Fill Hero Data
    const heroCode = document.getElementById('heroCode');
    const heroTitle = document.getElementById('heroTitle');
    const heroDesc = document.getElementById('heroDesc');
    const heroDate = document.getElementById('heroDate');
    const heroPlatform = document.getElementById('heroPlatform');

    if (heroCode) heroCode.innerText = data.kode_event || 'PLR-POCI-001';
    if (heroTitle) heroTitle.innerText = data.nama_acara || 'POCI';
    if (heroDesc) heroDesc.innerText = data.deskripsi_singkat || '';
    if (heroDate) heroDate.innerText = data.tanggal_waktu || '-';
    if (heroPlatform) heroPlatform.innerText = data.platform || '-';

    // Render Cards Grid & Master Link Drive
    renderKategoriCards(data.kategori_peserta || [], data.master_link_drive || '#');

    // Render Syarat
    const listSyarat = document.getElementById('listSyarat');
    if (listSyarat && Array.isArray(data.syarat_pendaftaran)) {
      listSyarat.innerHTML = data.syarat_pendaftaran.map(s => `<li>${s}</li>`).join('');
    }

    // Render Fasilitas
    const listFasilitas = document.getElementById('listFasilitas');
    if (listFasilitas && Array.isArray(data.fasilitas)) {
      listFasilitas.innerHTML = data.fasilitas.map(f => `<li>${f}</li>`).join('');
    }

    // Render Jadwal & Kontak
    if (data.jadwal) {
      const jDaftar = document.getElementById('jadwalDaftar');
      const jKerja = document.getElementById('jadwalKerja');
      if (jDaftar) jDaftar.innerText = data.jadwal.pendaftaran || '-';
      if (jKerja) jKerja.innerText = data.jadwal.pengerjaan || '-';
    }

    if (data.kontak) {
      const kWA = document.getElementById('kontakWA');
      const kIG = document.getElementById('kontakIG');
      if (kWA) kWA.innerText = data.kontak.wa || '-';
      if (kIG) kIG.innerText = data.kontak.ig || '-';
    }

  } catch (err) {
    console.error("Informasi Error POCI:", err.message);
  }
}

// 2. RENDER KATALOG KARTU CABANG LOMBA & BANNER DRIVE
function renderKategoriCards(kategoriList, driveUrl) {
  const container = document.getElementById('syllabusGridContainer');
  if (!container) return;

  let html = `
    <div class="drive-banner-card">
      <div class="drive-banner-info">
        <h3>📂 Repositori Silabus Ujian POCI</h3>
        <p>Akses seluruh berkas PDF silabus lengkap per mata pelajaran langsung melalui Google Drive resmi.</p>
      </div>
      <a href="${driveUrl}" target="_blank" class="btn-drive-action">
        Buka Google Drive ➔
      </a>
    </div>
  `;

  kategoriList.forEach(kat => {
    let cardsHtml = '';
    (kat.bidang || []).forEach(item => {
      // Jika bidang berupa object dengan properti ringkasan
      const mapelName = item.mapel || item;
      const mapelIcon = item.icon || '📘';
      const mapelTag = item.tag || 'Olimpiade';
      const mapelSummary = item.ringkasan || 'Silabus resmi tingkat nasional yang disesuaikan dengan standar olimpiade.';

      cardsHtml += `
        <div class="mapel-card">
          <div class="mapel-card-header">
            <span class="mapel-icon">${mapelIcon}</span>
            <div>
              <h4 class="mapel-name">${mapelName}</h4>
              <span class="mapel-tag">${mapelTag}</span>
            </div>
          </div>
          <p class="mapel-summary">${mapelSummary}</p>
          <a href="${driveUrl}" target="_blank" class="btn-card-silabus">
            Lihat Silabus PDF 📄
          </a>
        </div>
      `;
    });

    html += `
      <div class="kategori-block">
        <h3 class="kategori-title">🎓 ${kat.tingkat}</h3>
        <div class="mapel-cards-grid">
          ${cardsHtml}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}
