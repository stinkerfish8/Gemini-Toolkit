// ==UserScript==
// @name         Gemini Toolkit
// @namespace    stinkerfish8
// @version      1.1.0
// @description  Enhances Gemini UI with a message saver tool
// @author       Stinker_Fish
// @match        https://gemini.google.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to download text as a .txt file
    function downloadText(text) {
        // 1. Ask the user for a filename
        let fileName = prompt("Enter a filename for your note:", "gemini_note");

        // 2. If user cancels (clicks Cancel), stop the function
        if (fileName === null) return;

        // 3. If user leaves it empty, use a default name
        if (fileName.trim() === "") fileName = "gemini_note";

        // 4. Create the "Blob" (the data package)
        const blob = new Blob([text], { type: 'text/plain' });

        // 5. Create a temporary invisible link (anchor)
        const anchor = document.createElement('a');

        // 6. Set the filename with the .txt extension
        anchor.download = fileName.trim() + ".txt";
        
        // 7. Create a temporary URL for the Blob and "click" it
        anchor.href = URL.createObjectURL(blob);
        anchor.click();

        // 8. Clean up the temporary URL from memory
        URL.revokeObjectURL(anchor.href);
    }

    // Main loop to check for new messages every 2 seconds
    setInterval(() => {
        // Find all possible message containers in Gemini's UI
        const messages = document.querySelectorAll('.message-content, .model-response-text, .user-query');

        messages.forEach(msg => {
            // Add the button ONLY if it hasn't been added yet
            if (!msg.querySelector('.save-button')) {
                const btn = document.createElement('button');
                btn.innerText = '📌 Save';
                btn.className = 'save-button';
                
                // Button Styling (White background, bold text)
                btn.style = "margin-left: 10px; cursor: pointer; padding: 4px 8px; border-radius: 5px; background: #ffffff; color: #000; border: 1px solid #ccc; font-size: 12px; font-weight: bold;";

                // Action when clicked
                btn.onclick = () => {
                    // Get message text, remove the "Save" label from it, and trim spaces
                    const text = msg.innerText.replace('📌 Save', '').trim();
                    downloadText(text);
                };

                // Attach the button to the message
                msg.appendChild(btn);
            }
        });
    }, 2000);
})();
