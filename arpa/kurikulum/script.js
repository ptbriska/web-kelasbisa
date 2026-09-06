/**
 * ARPA MODULE — KURIKULUM SCIENTIFIC PAPER ENGINE
 * Fetches info.json and renders a two-column/one-column academic research article layout.
 */

let masterPaperData = null;

document.addEventListener("DOMContentLoaded", function () {
  initKurikulumPage();
});

async function initKurikulumPage() {
  masterPaperData = await fetchInfoJson();
  if (!masterPaperData) return;

  renderPaperMeta(masterPaperData.meta);
  renderPaperBody(masterPaperData);
}

// FETCH DATA FROM INFO.JSON
async function fetchInfoJson() {
  try {
    let res = await fetch('info.json');
    if (!res.ok) res = await fetch('./info.json');
    if (!res.ok) throw new Error("Gagal mengambil info.json");
    return await res.json();
  } catch (err) {
    console.error("ARPA Kurikulum Fetch Error:", err.message);
    return null;
  }
}

// 1. RENDER HEADER & ABSTRACT META
function renderPaperMeta(meta) {
  if (!meta) return;
  if (meta.title) document.getElementById('paperTitle').innerText = meta.title;
  if (meta.subtitle) document.getElementById('paperSubtitle').innerText = meta.subtitle;
  if (meta.brand_affiliation) document.getElementById('paperAuthors').innerText = meta.brand_affiliation;
  if (meta.abstract) document.getElementById('paperAbstract').innerText = meta.abstract;
}

// 2. RENDER FULL PAPER BODY
function renderPaperBody(data) {
  const container = document.getElementById('paperBodyContainer');
  if (!container) return;

  let bodyHTML = "";

  // 1. INTRODUCTION & DOMAINS
  bodyHTML += `
    <section class="paper-section">
      <h2 class="section-title">1. Introduction</h2>
      <p class="section-intro-text">
        ARPA focuses on three core knowledge domains as the foundation of its research and publication ecosystem.
      </p>

      ${(data.core_domains || []).map(domain => `
        <div class="subsection-block">
          <h3 class="subsection-title">${domain.code} ${domain.name}</h3>
          <p class="subsection-desc">${domain.description}</p>
          <ul class="paper-bullet-list">
            ${(domain.sub_items || []).map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </section>
  `;

  // 2. METHODOLOGY & TOOLS
  bodyHTML += `
    <section class="paper-section">
      <h2 class="section-title">2. Methodology</h2>
      <p class="section-intro-text">
        ARPA integrates various research tools and academic skill systems to support research workflow and scientific publication activities.
      </p>

      ${(data.tools_ecosystem || []).map(cat => `
        <div class="subsection-block">
          <h3 class="subsection-title">${cat.code} ${cat.category_name}</h3>
          <ul class="paper-bullet-list">
            ${(cat.tools_list || []).map(tool => `<li>${tool}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </section>
  `;

  // 3. RESULTS & DISCUSSION
  if (data.expected_outcomes) {
    bodyHTML += `
      <section class="paper-section">
        <h2 class="section-title">${data.expected_outcomes.title || '3. Results & Discussion'}</h2>
        <p class="section-intro-text">${data.expected_outcomes.description}</p>
        <ul class="paper-bullet-list">
          ${(data.expected_outcomes.capabilities || []).map(cap => `<li>${cap}</li>`).join('')}
        </ul>
      </section>
    `;
  }

  // 4. CONCLUSION
  if (data.conclusion) {
    bodyHTML += `
      <section class="paper-section">
        <h2 class="section-title">${data.conclusion.title || '4. Conclusion'}</h2>
        <p class="conclusion-text">${data.conclusion.text}</p>
      </section>
    `;
  }

  container.innerHTML = bodyHTML;
}
