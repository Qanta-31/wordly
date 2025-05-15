// Fetch saved words from chrome.storage
chrome.storage.local.get(["wordly_words"], (result) => {
    const list = result.wordly_words || [];  // Default to empty array if no words are found
    const recentList = document.getElementById("recent-list");
  
    // Clear the list before adding new items
    recentList.innerHTML = '';
  
    // Display the latest 5 words
    list.slice(0, 5).forEach(entry => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${entry.word}</strong>: ${entry.meaning}`;
      recentList.appendChild(li);
    });
  });
  
  // Add event listener to the "See all words" button
  document.getElementById('see-all-words-btn').addEventListener('click', function() {
    // Open the options page in a new tab
    chrome.tabs.create({ url: chrome.runtime.getURL('options/options.html') });
  });
  