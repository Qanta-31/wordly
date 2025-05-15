chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "SAVE_WORD") {
      const { word, meaning } = message;
  
      // Retrieve the existing list of saved words from storage
      chrome.storage.local.get("wordly_words", (result) => {
        const savedWords = result.wordly_words || [];
  
        // Check if the word already exists in the list
        const wordIndex = savedWords.findIndex((item) => item.word === word);
  
        if (wordIndex === -1) {
          // If the word doesn't exist, add it to the top
          savedWords.unshift({ word, meaning });
        } else {
          // If the word exists, remove it from its current position and add it to the top
          savedWords.splice(wordIndex, 1);  // Remove the word
          savedWords.unshift({ word, meaning });  // Add the word to the top
        }
  
        // Save the updated list back to local storage
        chrome.storage.local.set({ wordly_words: savedWords }, () => {
          console.log("Word saved successfully:", word);
        });
      });
    }
  });
  