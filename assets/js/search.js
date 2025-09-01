(function(){
  const searchJsonUrl = '/search.json';
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

  function renderLoading(resultsEl){
    resultsEl.innerHTML = '';
    const li = document.createElement('li');
    li.textContent = '...';
    li.style.padding = '6px 8px';
    resultsEl.appendChild(li);
    resultsEl.style.display = 'block';
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

    renderLoading(resultsEl);

    const posts = await loadIndex();
    const results = posts.filter(p => {
      const t = (p.title || '').toLowerCase();
      const c = (p.content || '').toLowerCase();
      return t.includes(q) || c.includes(q);
    });

    renderResults(results, resultsEl);
  }

  function positionResults(input, resultsEl){
    const rect = input.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  
    resultsEl.style.width = rect.width + 'px';
    resultsEl.style.top = (rect.bottom + scrollTop) + 'px';
    resultsEl.style.left = (rect.left + scrollLeft) + 'px';
  }

  function bindSearchInput(searchId, resultsId){
    const input = document.getElementById(searchId);
    const resultsEl = document.getElementById(resultsId);
    if (!input || !resultsEl) return;

    // initial positioning
    positionResults(input, resultsEl);

    // update positioning on resize
    window.addEventListener('resize', () => positionResults(input, resultsEl));

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
        const firstLink = resultsEl.querySelector('a');
        if (firstLink) window.location.href = firstLink.href;
      } else if (e.key === 'Escape') {
        clearResults(resultsEl);
      }
    });

    document.addEventListener('click', function(e){
      if (!input.contains(e.target) && !resultsEl.contains(e.target)) {
        resultsEl.style.display = 'none';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    bindSearchInput('searchBox','results');
  });
})();
