/**
 * ARPA MODULE — PROGRAM SHOWCASE & COMPARISON TABLE ENGINE
 * Dynamic rendering of pricing cards, feature comparisons, and operational tables from info.json[cite: 5].
 */

let masterProgramData = null;
let activeCategoryId = "jurnal-sinta";

document.addEventListener("DOMContentLoaded", function () {
  initProgramPage();
});

async function initProgramPage() {
  masterProgramData = await fetchInfoJson();
  if (!masterProgramData || !masterProgramData.kategori_produk) return;

  renderActiveCategory(activeCategoryId);
}

// FETCH DATA FROM INFO.JSON
async function fetchInfoJson() {
  try {
    let res = await fetch('info.json');
    if (!res.ok) res = await fetch('./info.json');
    if (!res.ok) throw new Error("Gagal mengambil info.json");
    return await res.json();
  } catch (err) {
    console.error("ARPA Program Fetch Error:", err.message);
    return null;
  }
}

// CATEGORY SWITCHER
function switchCategory(catId) {
  activeCategoryId = catId;

  // Update tab buttons
  const tabs = document.querySelectorAll('.cat-tab-btn');
  tabs.forEach(tab => {
    tab.classList.remove('active');
    if (tab.getAttribute('onclick').includes(catId)) {
      tab.classList.add('active');
    }
  });

  renderActiveCategory(catId);
}

// RENDER ALL TABLES & CARDS FOR ACTIVE CATEGORY
function renderActiveCategory(catId) {
  const catData = masterProgramData.kategori_produk.find(c => c.id === catId);
  if (!catData) return;

  // 1. Meta Banner
  document.getElementById('catNama').innerText = catData.nama_kategori;
  document.getElementById('catDeskripsi').innerText = catData.deskripsi;

  const tiers = catData.tier_list;

  // 2. Pricing Cards
  renderPricingCards(catData.harga_per_orang, tiers);

  // 3. Table Penulisan Ilmiah & Teknik Riset
  renderComparisonTable('tablePenulisan', catData.fitur_penulisan_dan_teknik, tiers);

  // 4. Table Presentasi Ilmiah (Jika Ada)
  const wrapperPresentasi = document.getElementById('wrapperPresentasi');
  if (catData.presentasi_ilmiah && catData.presentasi_ilmiah.length > 0) {
    wrapperPresentasi.style.display = 'block';
    renderComparisonTable('tablePresentasi', catData.presentasi_ilmiah, tiers);
  } else {
    wrapperPresentasi.style.display = 'none';
  }

  // 5. Table Operasional Dasar
  renderComparisonTable('tableOperasional', catData.operasional_dasar, tiers, true);
}

// RENDER PRICING CARDS
function renderPricingCards(hargaObj, tiers) {
  const container = document.getElementById('priceCardsContainer');
  if (!container || !hargaObj || !tiers) return;

  container.innerHTML = tiers.map(tier => {
    const rawKey = tier.replace('+', '_PLUS').replace(' (PLATO / PLATIPUS)', '').replace(' ', '_');
    const priceVal = hargaObj[tier] || hargaObj[rawKey] || "-";

    return `
      <div class="price-card">
        <span class="price-tier-badge">${tier}</span>
        <div class="price-value">Rp ${priceVal}</div>
        <a href="https://wa.me/6282268118842?text=Halo%20Admin%20ARPA,%20saya%20ingin%20daftar%20paket%20${encodeURIComponent(tier)}" target="_blank" rel="noopener" class="btn-card-select">
          Pilih Paket ➔
        </a>
      </div>
    `;
  }).join('');
}

// GENERIC TABLE RENDERER
function renderComparisonTable(tableId, featureList, tiers, isOperational = false) {
  const table = document.getElementById(tableId);
  if (!table || !featureList || !Array.isArray(featureList)) return;

  // Build Header Row
  let headerHTML = `
    <thead>
      <tr>
        <th class="col-feature">ASPEK / FITUR</th>
        ${tiers.map(t => `<th class="col-tier">${t}</th>`).join('')}
      </tr>
    </thead>
  `;

  // Build Body Rows
  let bodyHTML = `
    <tbody>
      ${featureList.map(item => {
        const featureName = item.fitur;
        const dataObj = isOperational ? item.detail : item.akses;

        return `
          <tr>
            <td class="col-feature-title">${featureName}</td>
            ${tiers.map(t => {
              const rawKey = t.replace('+', '_PLUS').replace(' (PLATO / PLATIPUS)', '').replace(' ', '_');
              let val = dataObj ? (dataObj[t] || dataObj[rawKey] || "-") : "-";

              // Formatting visual status badge
              let badgeClass = "val-text";
              if (val === "V") {
                val = "✓";
                badgeClass = "val-check";
              } else if (val === "-") {
                badgeClass = "val-dash";
              }

              return `<td class="col-tier-val"><span class="${badgeClass}">${val}</span></td>`;
            }).join('')}
          </tr>
        `;
      }).join('')}
    </tbody>
  `;

  table.innerHTML = headerHTML + bodyHTML;
}
