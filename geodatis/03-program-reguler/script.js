/**
 * GEODATIS — MODULE 03 PROGRAM REGULER ENGINE
 * Domino Stack Cards, Dynamic Renderers with Fallback Data, and Lightbox Preview Modal.
 */

// EMBEDDED FALLBACK DATA (Mencegah tampilan blank jika fetch/CORS gagal)
const fallbackRegulerData = {
  "page_meta": {
    "title": "Program Reguler GEODATIS",
    "subtitle": "Layanan B2C / Individu untuk Penguasaan Skill Geospatial Data & Statistics",
    "katalog_event_url": "https://kelasbisa.com/events/"
  },
  "daftar_program": [
    {
      "id": "prog-01",
      "kode": "WebGRIDS",
      "nama": "WebGRIDS (Zoominar)",
      "format": "Zoominar | Gratis",
      "frekuensi": "1x / Bulan (Awal Bulan)",
      "deskripsi": "Program Webinar on Geospatial Research, Intelligence & Data Series yang diadakan sekali per bulan di awal bulan."
    },
    {
      "id": "prog-02",
      "kode": "REGULER",
      "nama": "Reguler Short Course",
      "format": "Short Course | Plato/Platipus/Ketal",
      "frekuensi": "4x / Bulan",
      "deskripsi": "Program yang diadakan 4x per bulan yang membahas pengolahan data di berbagai sektor dengan berbagai software."
    },
    {
      "id": "prog-03",
      "kode": "GUIDED",
      "nama": "Guided Medium Course",
      "format": "Medium Course | Plato/Platipus/Ketal",
      "frekuensi": "1x / Bulan",
      "deskripsi": "Program yang diadakan sekali per bulan yang membahas pengolahan data di berbagai sektor dengan berbagai software."
    },
    {
      "id": "prog-04",
      "kode": "GUIDED_PLUS",
      "nama": "Guided+ Bootcamp",
      "format": "Bootcamp | Plato/Platipus/Ketal",
      "frekuensi": "1x / Semester",
      "deskripsi": "Program yang diadakan sekali per semester yang membahas pengolahan data di berbagai sektor dengan berbagai software."
    },
    {
      "id": "prog-05",
      "kode": "CONSUL",
      "nama": "Consul (Private & Group Request)",
      "format": "Flexible Duration | EXTRA",
      "frekuensi": "On-Demand (By Request)",
      "deskripsi": "Program yang diadakan khusus jika ada yang request ke GEODATIS untuk tutorial analisa dan pengolahan data secara individu dan kelompok."
    }
  ],
  "rangkuman_fasilitas": {
    "judul": "Fasilitas & Ekosistem Pembelajaran B2C",
    "deskripsi": "Benefit lengkap yang disesuaikan dengan tipe program yang kamu ambil di GEODATIS.",
    "list_fasilitas": [
      {
        "kategori": "Akses & Platform",
        "detail": "Akses live session interaktif via Zoom serta integrasi ekosistem platform Plato, Platipus, Ketal, hingga kelas EXTRA."
      },
      {
        "kategori": "Materi & Modul Praktik",
        "detail": "Modul eksklusif, dataset terapan sektor riil, serta rekaman sesi yang dapat dipelajari ulang secara mandiri."
      },
      {
        "kategori": "Sertifikat & Evaluasi",
        "detail": "Sertifikat kelulusan berbasis kompetensi dan asesmen kinerja berbasis proyek nyata."
      },
      {
        "kategori": "Mentoring & On-Demand Request",
        "detail": "Pendampingan oleh mentor praktisi serta opsi konsultasi privat/kelompok untuk kasus pengolahan data spesifik."
      }
    ]
  },
  "rangkuman_poster": [
    {
      "id": "post-01",
      "judul_poster": "Poster WebGRIDS Series",
      "kategori": "Zoominar Gratis",
      "file_gambar": "poster-reguler-1.jpg",
      "caption": "Sesi berbagi wawasan tren geospasial & riset data series bulanan."
    },
    {
      "id": "post-02",
      "judul_poster": "Poster Short Course Batch",
      "kategori": "Short Course",
      "file_gambar": "poster-reguler-2.jpg",
      "caption": "Intensif 4 kali sebulan untuk berbagai software & sektor terapan."
    },
    {
      "id": "post-03",
      "judul_poster": "Poster Guided Medium Course",
      "kategori": "Medium Course",
      "file_gambar": "poster-reguler-3.jpg",
      "caption": "Penyelaman materi terstruktur bulanan dengan pendampingan praktik."
    },
    {
      "id": "post-04",
      "judul_poster": "Poster Guided+ Bootcamp",
      "kategori": "Bootcamp Semesteran",
      "file_gambar": "poster-reguler-4.jpg",
      "caption": "Program bootcamp komprehensif semesteran untuk output portofolio."
    },
    {
      "id": "post-05",
      "judul_poster": "Poster Consul Request",
      "kategori": "Private / Custom",
      "file_gambar": "poster-reguler-5.jpg",
      "caption": "Tutorial dan analisa data khusus on-demand sesuai kebutuhan kasusmu."
    }
  ]
};

let masterRegulerData = null;

document.addEventListener("DOMContentLoaded", function () {
  initRegulerModule();
});

async function initRegulerModule() {
  masterRegulerData = await fetchRegulerData();
  
  // Jika fetch gagal/null, otomatis pakai fallbackRegulerData
  if (!masterRegulerData) {
    masterRegulerData = fallbackRegulerData;
  }

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
    console.warn("GEODATIS Reguler Fetch Warning:", err.message, "— Menggunakan fallback data internal.");
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
