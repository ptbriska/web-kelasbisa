/**
 * GEODATIS — MAIN HOME & SHARED ENGINE ROUTER
 * Handles subnav dynamic active link highlighting and shared components.
 */

document.addEventListener("DOMContentLoaded", function () {
  initGeodatisMain();
});

function initGeodatisMain() {
  highlightActiveSubnav();
}

/**
 * Otomatis mendeteksi halaman yang sedang dibuka
 * dan memberikan class .active pada link sub-header internal GEODATIS.
 */
function highlightActiveSubnav() {
  const currentPath = window.location.pathname;
  const subnavLinks = document.querySelectorAll('.subnav-menu a, .geodatis-subnav a');

  if (!subnavLinks || subnavLinks.length === 0) return;

  subnavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    if (currentPath.endsWith(href) || currentPath.includes(href.replace('index.html', ''))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
