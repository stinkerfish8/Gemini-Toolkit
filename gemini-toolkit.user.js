// ==UserScript==
// @name         Gemini Toolkit
// @namespace    https://github.com/stinkerfish8/gemini-toolkit
// @version      1.0.0
// @description  Essential toolkit for Google Gemini.
// @author       Stinker_Fish (assisted by Gemini AI)
// @match        https://gemini.google.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to download text as a .txt file
    function downloadText(text) {
        const blob = new Blob([text], { type: 'text/plain' });
        const anchor = document.createElement('a');
        anchor.download = 'gemini_note.txt';
        anchor.href = URL.createObjectURL(blob);
        anchor.click();
        URL.revokeObjectURL(anchor.href);
    }

    // Main loop to handle dynamic content (runs every 2 seconds)
    setInterval(() => {
        // Find all message containers in Gemini's interface
        const messages = document.querySelectorAll('.message-content, .message-content-wrapper, message-content');
        
        messages.forEach(msg => {
            // Add the "Save" button only if it hasn't been added yet
            if (!msg.querySelector('.pin-button')) {
                const btn = document.createElement('button');
                btn.innerHTML = '📌 Save';
                btn.className = 'pin-button';
                
                // Button styling
                btn.style = "display: inline-block; margin: 10px 0; padding: 4px 10px; cursor: pointer; border-radius: 8px; border: 1px solid #ddd; background: #ffffff; color: #333; font-size: 12px; font-weight: bold; box-shadow: 0 1px 2px rgba(0,0,0,0.1);";
                
                btn.onclick = (e) => {
                    e.stopPropagation();
                    // Extract text while excluding the button text itself
                    const text = msg.innerText.replace('📌 Save', '').trim();
                    downloadText(text);
                };
                
                msg.appendChild(btn);
            }
        });
    }, 2000);
})();
