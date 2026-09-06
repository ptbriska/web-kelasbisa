/**
 * GEODATIS — MODULE 08 BANK DATA ENGINE
 * Pure Fetcher for Tools and Geodatabase with Tokopedia-style Filtering & Dual CTA Token Modal.
 */

let masterGeodatabase = [];
let selectedDatasetForToken = null;

document.addEventListener("DOMContentLoaded", function () {
  initBankDataModule();
});

async function initBankDataModule() {
  await loadToolsData();
  await loadGeodatabase();
}

// 1. FETCH & RENDER SOFTWARE TOOLS
async function loadToolsData() {
  try {
    let res = await fetch('tools.json');
    if (!res.ok) res = await fetch('./tools.json');
    if (!res.ok) throw new Error("Gagal mengambil tools.json");
    const data = await res.json();
    renderToolsGrid(data.tools_list);
  } catch (err) {
    console.error("GEODATIS Tools Fetch Error:", err.message);
  }
}

function renderToolsGrid(tools) {
  const container = document.getElementById('toolsContainer');
  if (!container || !tools) return;

  container.innerHTML = tools.map(t => `
    <div class="tool-card">
      <div>
        <span class="tool-cat">${t.kategori}</span>
        <h3>${t.nama}</h3>
        <p class="tool-desc">${t.deskripsi}</p>
      </div>
      <a href="${t.link_download}" target="_blank" rel="noopener" class="btn-tool-dl">⚡ Download Official Installer ➔</a>
    </div>
  `).join('');
}

// 2. FETCH & RENDER GEODATABASE MARKETPLACE
async function loadGeodatabase() {
  try {
    let res = await fetch('geodatabase.json');
    if (!res.ok) res = await fetch('./geodatabase.json');
    if (!res.ok) throw new Error("Gagal mengambil geodatabase.json");
    const data = await res.json();
    masterGeodatabase = data.dataset_list || [];
    renderDatasetGrid(masterGeodatabase);
  } catch (err) {
    console.error("GEODATIS Geodatabase Fetch Error:", err.message);
  }
}

function renderDatasetGrid(datasets) {
  const container = document.getElementById('datasetContainer');
  if (!container) return;

  if (!datasets || datasets.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--geo-text-muted);">Tidak ada dataset yang sesuai filter.</div>`;
    return;
  }

  container.innerHTML = datasets.map(d => {
    const isOpen = d.akses === "Open Access";
    
    let actionButtons = "";
    if (isOpen) {
      actionButtons = `
        <a href="${d.link_download}" target="_blank" rel="noopener" class="btn-open-dl">
          ⬇️ Download (Open Access)
        </a>
      `;
    } else {
      actionButtons = `
        <button class="btn-token-dl" onclick="openTokenModal('${d.id}')">
          🔑 Input Token Akses
        </button>
        <a href="https://wa.me/6282268118842?text=Halo%20Admin%20GEODATIS,%20saya%20ingin%20membeli%20akses%20dataset%20Eksklusif:%20${encodeURIComponent(d.nama_dataset)}" target="_blank" rel="noopener" class="btn-cs-wa">
          💬 Beli Akses via CS
        </a>
      `;
    }

    return `
      <div class="ds-card">
        <div class="ds-cover">
          <img src="${d.cover_file}" alt="${d.nama_dataset}" onerror="this.src='../../assets/images/logo-kelasbisa.png'">
          <span class="ds-badge-access ${isOpen ? 'badge-open' : 'badge-exclusive'}">
            ${d.akses}
          </span>
        </div>

        <div class="ds-body">
          <h4 class="ds-title" title="${d.nama_dataset}">${d.nama_dataset}</h4>
          <div class="ds-meta">📌 <strong>Domain:</strong> ${d.sektor}</div>
          <div class="ds-meta">💾 <strong>Format:</strong> ${d.format}</div>
          <div class="ds-meta">🌍 <strong>Wilayah:</strong> ${d.wilayah} (${d.ukuran})</div>
        </div>

        <div class="ds-actions">
          ${actionButtons}
        </div>
      </div>
    `;
  }).join('');
}

// 3. FILTERING LOGIC
function applyFilters() {
  const domainVal = document.getElementById('filterDomain').value;
  const formatVal = document.getElementById('filterFormat').value;
  const wilayahVal = document.getElementById('filterWilayah').value;
  const aksesVal = document.getElementById('filterAkses').value;

  const filtered = masterGeodatabase.filter(d => {
    const matchDomain = (domainVal === 'ALL') || (d.sektor === domainVal);
    const matchFormat = (formatVal === 'ALL') || (d.format === formatVal);
    const matchWilayah = (wilayahVal === 'ALL') || (d.wilayah === wilayahVal);
    const matchAkses = (aksesVal === 'ALL') || (d.akses === aksesVal);
    return matchDomain && matchFormat && matchWilayah && matchAkses;
  });

  renderDatasetGrid(filtered);
}

function resetFilters() {
  document.getElementById('filterDomain').value = 'ALL';
  document.getElementById('filterFormat').value = 'ALL';
  document.getElementById('filterWilayah').value = 'ALL';
  document.getElementById('filterAkses').value = 'ALL';
  renderDatasetGrid(masterGeodatabase);
}

// 4. TOKEN MODAL LOGIC FOR EXCLUSIVE DATA
function openTokenModal(datasetId) {
  selectedDatasetForToken = masterGeodatabase.find(d => d.id === datasetId);
  if (!selectedDatasetForToken) return;

  document.getElementById('inputTokenVal').value = '';
  document.getElementById('tokenErrorMsg').style.display = 'none';
  document.getElementById('tokenModal').classList.add('active');
}

function validateAndSubmitToken() {
  if (!selectedDatasetForToken) return;

  const inputVal = document.getElementById('inputTokenVal').value.trim();
  const validToken = selectedDatasetForToken.token_akses;

  // Validasi token spesifik per data atau master token
  if (inputVal === validToken || inputVal === 'GEO2026') {
    window.open(selectedDatasetForToken.link_download, '_blank');
    forceCloseTokenModal();
  } else {
    document.getElementById('tokenErrorMsg').style.display = 'block';
  }
}

function closeTokenModal(e) {
  if (e.target.id === 'tokenModal') {
    forceCloseTokenModal();
  }
}

function forceCloseTokenModal() {
  document.getElementById('tokenModal').classList.remove('active');
  selectedDatasetForToken = null;
}
