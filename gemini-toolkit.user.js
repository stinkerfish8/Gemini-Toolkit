// ==UserScript==
// @name         Gemini Toolkit
// @namespace    stinkerfish8
// @version      1.2.0
// @description  Enhances Gemini UI with a message saver tool
// @author       Stinker_Fish (assisted by Gemini AI)
// @match        https://gemini.google.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to download text as a .txt file
    function downloadText(text) {
        //file name
        let fileName = prompt("Enter a filename for your note:", "gemini_note");
        if (fileName === null) return;
        if (fileName.trim() === "") fileName = "gemini_note";

        //format choice
        let format = prompt("2/2: Choose format (txt, md, rtf):", "txt").toLowerCase().trim();
        if (format === null) return;

        //validation: default to txt if the input is not recognized
        const validFormats = ["txt", "md", "rtf"]
        if (!validFormats.includes(format)) {
            format = "txt";
        }

        //set the correct MIME type based on format
        let mimeType = 'text/plain';
        if (format === 'rtf') mimeType = 'application/rtf';

        //create the data package
        const blob = new Blob([text], { type: mimeType });

        //create the anchor
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
