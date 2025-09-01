async function searchPosts() {
  const searchBox = document.getElementById("searchBox");
  const query = searchBox.value.toLowerCase();

  const response = await fetch("/search.json");
  const posts = await response.json();

  const results = posts.filter(post =>
    post.title.toLowerCase().includes(query) ||
    post.content.toLowerCase().includes(query)
  );

  let resultList = document.getElementById("results");
  resultList.innerHTML = "";

  if (query.trim() === "") {
    return; // ak je prázdne pole, nič nezobrazi
  }

  results.forEach(r => {
    let item = document.createElement("li");
    item.innerHTML = `<a href="${r.url}">${r.title}</a>`;
    resultList.appendChild(item);
  });
}

// Udalosti po načítaní stránky
document.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.getElementById("searchBox");

  if (searchBox) {
    // Enter – zastaví defaultné správanie formulára a spustí vyhľadávanie
    searchBox.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();   // zabráni reloadu stránky
        searchPosts();
      }
    });

    // Živé vyhľadávanie počas písania
    searchBox.addEventListener("input", () => {
      searchPosts();
    });
  }
});
