(function(){
  // Robust search for Jekyll/GitHub Pages. Slovak comments.
  // Zistí, odkiaľ sa načítal tento skript a podľa toho zostaví URL na search.json
  const scripts = document.getElementsByTagName('script');
  let selfScript = null;
  for (let i = scripts.length - 1; i >= 0; i--) {
    const s = scripts[i];
    if (!s.src) continue;
    if (s.src.indexOf('assets/js/search.js') !== -1 || s.src.indexOf('/assets/js/search.js') !== -1) {
      selfScript = s;
      break;
    }
  }

  const searchJsonUrl = selfScript ? new URL('../search.json', selfScript.src).href : '/search.json';

  let postsCache = null;

  async function loadIndex(){
    if (postsCache) return postsCache;
    try {
      const res = await fetch(searchJsonUrl, {cache: 'no-store'});
      if (!res.ok) throw new Error('fetch failed ' + res.status);
      postsCache = await res.json();
      return postsCache;
    } catch (err) {
      console.error('Chyba pri načítaní search.json:', err);
      postsCache = [];
      return postsCache;
    }
  }

  function clearResults(resultsEl){
    resultsEl.innerHTML = '';
    resultsEl.style.display = 'none';
  }

  function renderResults(results, resultsEl){
    resultsEl.innerHTML = '';
    if (!results || results.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'Nenašlo sa nič.';
      li.style.padding = '6px 8px';
      resultsEl.appendChild(li);
      resultsEl.style.display = 'block';
      return;
    }

    results.forEach(r => {
      const li = document.createElement('li');
      li.style.listStyle = 'none';
      const a = document.createElement('a');
      a.href = r.url;
      a.textContent = r.title;
      a.style.display = 'block';
      a.style.padding = '6px 8px';
      a.style.textDecoration = 'none';
      a.style.color = 'inherit';
      li.appendChild(a);
      resultsEl.appendChild(li);
    });

    resultsEl.style.display = 'block';
  }

  async function doSearch(query, resultsEl){
    const q = (query || '').trim().toLowerCase();
    if (!q) {
      clearResults(resultsEl);
      return;
    }
    const posts = await loadIndex();
    const results = posts.filter(p => {
      const t = (p.title || '').toLowerCase();
      const c = (p.content || '').toLowerCase();
      return (t.indexOf(q) !== -1) || (c.indexOf(q) !== -1);
    });
    renderResults(results, resultsEl);
  }

  function bindSearchInput(searchId, resultsId){
    const input = document.getElementById(searchId);
    const resultsEl = document.getElementById(resultsId);
    if (!input || !resultsEl) return;

    // debounce to avoid many fetches
    let debounce = null;

    input.addEventListener('input', function(){
      clearTimeout(debounce);
      debounce = setTimeout(function(){
        doSearch(input.value, resultsEl);
      }, 150);
    });

    input.addEventListener('keydown', async function(e){
      if (e.key === 'Enter') {
        e.preventDefault();
        await doSearch(input.value, resultsEl);
        // ak sú výsledky, otvoriť prvý výsledok (časté očakávanie používateľov)
        const firstLink = resultsEl.querySelector('a');
        if (firstLink) {
          window.location.href = firstLink.href;
        }
      } else if (e.key === 'Escape') {
        // Esc skryje výsledky
        clearResults(resultsEl);
      }
    });

    // ak klikne používateľ mimo, skryť výsledky (menu.html má tiež rovnakú logiku)
    document.addEventListener('click', function(e){
      if (!input.contains(e.target) && !resultsEl.contains(e.target)) {
        resultsEl.style.display = 'none';
      }
    });

    // expose API kompatibilné s existujúcim kódom v menu.html
    window.simpleSearch = window.simpleSearch || {};
    window.simpleSearch.bindSearchInput = function(sid, rid){ bindSearchInput(sid, rid); };

    // initial bind: ak niekto volá bindSearchInput z menu.html, nech to funguje
    // (menu.html volá window.simpleSearch.bindSearchInput('searchBox','results');)
  }

  document.addEventListener('DOMContentLoaded', function(){
    bindSearchInput('searchBox','results');
  });

})();
