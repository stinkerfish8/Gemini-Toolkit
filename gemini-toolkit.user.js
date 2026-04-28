// ==UserScript==
// @name         Gemini Toolkit
// @namespace    https://github.com/stinkerfish8/Gemini-Toolkit
// @version      1.3.0
// @description  Enhances Gemini UI with a message saver tool
// @author       Stinker_Fish (assisted by Gemini AI)
// @match        https://gemini.google.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to download text
    function downloadText(msgElement) {
        // Prompt for the file name
        let fileName = prompt("1/2: Enter filename:", "gemini_note");
        if (fileName === null) return;
        if (fileName.trim() === "") fileName = "gemini_note";

        // Prompt for the format choice
        let format = prompt("2/2: Choose format (txt, md, rtf, html):", "txt").toLowerCase().trim();
        if (format === null) return;

        // Validation updated
        const validFormats = ["txt", "md", "rtf", "html"];
        if (!validFormats.includes(format)) {
            format = "txt";
        }

        let content;
        let mimeType = 'text/plain';

        if (format === 'html') {
            // If html is selected, get innerHTML
            content = msgElement.innerHTML.replace(/📌 Save/g, ''); 
            mimeType = 'text/html';
        } else {
            // Fallback to plain text
            content = msgElement.innerText.replace('📌 Save', '').trim();
            if (format === 'rtf') mimeType = 'application/rtf';
        }

        // Create the Blob object
        const blob = new Blob([content], { type: mimeType });

        // Create the anchor
        const anchor = document.createElement('a');

        anchor.download = fileName.trim() + "." + format;
        anchor.href = URL.createObjectURL(blob);
        anchor.click();
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
                    downloadText(msg);
                };

                // Attach the button to the message
                msg.appendChild(btn);
            }
        });
    }, 2000);
})();
