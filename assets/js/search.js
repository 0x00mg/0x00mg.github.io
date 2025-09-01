(function() {
  const searchJsonUrl = '/search.json';
  let postsCache = null;

  async function loadIndex() {
    if (postsCache) return postsCache;
    try {
      const res = await fetch(searchJsonUrl, { cache: 'no-store' });
      postsCache = await res.json();
      return postsCache;
    } catch (err) {
      console.error('Error loading search.json:', err);
      postsCache = [];
      return postsCache;
    }
  }

  function clearResults(resultsEl) {
    resultsEl.innerHTML = '';
    resultsEl.style.display = 'none';
  }

  function renderResults(results, resultsEl) {
    resultsEl.innerHTML = '';
    if (!results.length) {
      resultsEl.innerHTML = '<li style="padding:6px 8px;">Nenašlo sa nič.</li>';
    } else {
      results.forEach(r => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = r.url;
        a.textContent = r.title;
        li.appendChild(a);
        resultsEl.appendChild(li);
      });
    }
    resultsEl.style.display = 'block';
  }

  async function doSearch(query, resultsEl) {
    const q = (query || '').trim().toLowerCase();
    if (!q) return clearResults(resultsEl);

    const posts = await loadIndex();
    const results = posts.filter(p => {
      const t = (p.title || '').toLowerCase();
      const c = (p.content || '').toLowerCase();
      return t.includes(q) || c.includes(q);
    });
    renderResults(results, resultsEl);
  }

  function bindSearchInput(searchId, resultsId) {
    const input = document.getElementById(searchId);
    const resultsEl = document.getElementById(resultsId);
    if (!input || !resultsEl) return;

    input.addEventListener('input', () => doSearch(input.value, resultsEl));

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const firstLink = resultsEl.querySelector('a');
        if (firstLink) window.location.href = firstLink.href;
      } else if (e.key === 'Escape') {
        clearResults(resultsEl);
      }
    });

    document.addEventListener('click', e => {
      if (!input.contains(e.target) && !resultsEl.contains(e.target)) {
        resultsEl.style.display = 'none';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => bindSearchInput('searchBox','results'));
})();
