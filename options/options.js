chrome.storage.local.get(["wordly_words"], (result) => {
  const list = result.wordly_words || [];
  const fullList = document.getElementById("full-list");
  const searchBar = document.getElementById("searchBar");

  // Function to render the word list
  const renderList = (filteredList) => {
    fullList.innerHTML = ''; // Clear the list before re-rendering

    if (filteredList.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent = filteredList === list ? "Add words in your vocabulary" : "No words found!";
      emptyMessage.style.textAlign = "center";
      fullList.appendChild(emptyMessage);
    } else {
      filteredList.forEach(entry => {
        const li = document.createElement("li");
        li.classList.add("word-item");
        li.innerHTML = `
          <div><strong>${entry.word}</strong></div>
          <div class="meaning">${entry.meaning}</div>
        `;
        fullList.appendChild(li);
      });
    }
  };

  // Initially render the full list
  renderList(list);

  // Search functionality - only check word, not meaning
  searchBar.addEventListener("input", () => {
    const searchTerm = searchBar.value.toLowerCase();
    const filteredList = list.filter(entry => 
      entry.word.toLowerCase().includes(searchTerm) // Only check if the word matches
    );

    // Render the filtered list or show "No words found"
    renderList(filteredList);
  });
});
