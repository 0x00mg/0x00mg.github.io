async function searchPosts() {
  const query = document.getElementById("searchBox").value.toLowerCase();
  const response = await fetch("/search.json");
  const posts = await response.json();

  const results = posts.filter(post =>
    post.title.toLowerCase().includes(query) ||
    post.content.toLowerCase().includes(query)
  );

  let resultList = document.getElementById("results");
  resultList.innerHTML = "";
  results.forEach(r => {
    let item = document.createElement("li");
    item.innerHTML = `<a href="${r.url}">${r.title}</a>`;
    resultList.appendChild(item);
  });
}

// Napojenie udalostí po načítaní stránky
document.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.getElementById("searchBox");

  if (searchBox) {
    // Spustí vyhľadávanie pri stlačení Enter
    searchBox.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        searchPosts();
      }
    });

    // Spustí vyhľadávanie aj počas písania (živé výsledky)
    searchBox.addEventListener("input", () => {
      searchPosts();
    });
  }
});

