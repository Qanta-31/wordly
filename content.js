document.addEventListener("mouseup", async (e) => {

    //Prevent triggering when tooltip is already visible
    if (document.getElementById("wordly-tooltip")) return;


    const selectedText = window.getSelection().toString().trim();
    if (!selectedText || selectedText.includes(" ")) return;

    removeElements();

    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${selectedText}`);
    const data = await response.json();
    const meaning = data[0]?.meanings[0]?.definitions[0]?.definition || "No definition found.";

    const box = document.createElement("div");
    box.id = "wordly-tooltip";
    box.style.position = "absolute";
    box.style.left = `${e.pageX + 10}px`;
    box.style.top = `${e.pageY + 20}px`;
    box.style.zIndex = 10000;
    box.style.background = "#ffffff";
    box.style.border = "1px solid #ccc";
    box.style.padding = "12px 16px";
    box.style.borderRadius = "10px";
    box.style.maxWidth = "320px";
    box.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
    box.style.fontFamily = "Segoe UI, sans-serif";
    box.style.lineHeight = "1.5";
    box.style.color = "#333";
    box.innerHTML = `
        <strong style="color:#117eca; font-size: 16px;">${selectedText}</strong><br/>
        <span style="display:block; margin-top: 8px;">${meaning}</span>
        <button id="wordly-save-btn" style="
            margin-top: 12px;
            background-color: #117eca;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
        ">Save</button>
    `;

    document.body.appendChild(box);

    let timeoutId = setRemoveTimer();

    document.getElementById("wordly-save-btn").addEventListener("click", () => {
        chrome.runtime.sendMessage({
            type: "SAVE_WORD",
            word: selectedText,
            meaning
        });
        showToast("Word saved!");
        removeElements();
    });

    // Pause auto-hide on hover
    box.addEventListener("mouseenter", () => clearTimeout(timeoutId));
    box.addEventListener("mouseleave", () => timeoutId = setRemoveTimer());

    document.addEventListener("mousedown", outsideClickListener);

    function removeElements() {
        const tooltip = document.getElementById("wordly-tooltip");
        if (tooltip) tooltip.remove();
        document.removeEventListener("mousedown", outsideClickListener);
    }

    function outsideClickListener(event) {
        const tooltip = document.getElementById("wordly-tooltip");
        if (!tooltip?.contains(event.target)) {
            removeElements();
        }
    }

    function setRemoveTimer() {
        return setTimeout(removeElements, 6000);
    }

    function showToast(message) {
        const toast = document.createElement("div");
        toast.textContent = message;
        toast.style.position = "fixed";
        toast.style.top = "20px";
        toast.style.right = "20px";
        toast.style.padding = "10px 16px";
        toast.style.backgroundColor = "black";
        toast.style.color = "white";
        toast.style.borderRadius = "6px";
        toast.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)";
        toast.style.fontFamily = "Segoe UI, sans-serif";
        toast.style.fontWeight = "bold"
        toast.style.zIndex = 10001;
        toast.style.opacity = "0";
        toast.style.transition = "opacity 0.4s ease";

        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = "1";
        });

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.addEventListener("transitionend", () => toast.remove());
        }, 3000);
    }
});
