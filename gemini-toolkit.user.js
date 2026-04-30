// ==UserScript==
// @name         Gemini Toolkit (DEPRECATED)
// @namespace    https://github.com/stinkerfish8/Gemini-Toolkit
// @version      1.4.0
// @description  Enhances Gemini UI with a message saver tool
// @author       Stinker_Fish (assisted by Gemini AI)
// @match        https://gemini.google.com/*
// @icon         https://favicon.im/gemini.google.com?larger=true
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Utility function: convert html to md
    function convertToMarkdown(html) {
        let md = html;

        // Remove the "Save" button from the output
        md = md.replace(/<button class="save-button".*?<\/button>/g, '');

        // Multiline Code Blocks: <pre><code>...</code></pre> -> ```...```
        // Using [\s\S]*? to include newlines inside code blocks
        md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/g, '\n```\n$1\n```\n');
        
        // Inline Code: <code>text</code> -> `text`
        md = md.replace(/<code>(.*?)<\/code>/g, '`$1`');

        // Bold: <strong> or <b> -> **text**
        md = md.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
        md = md.replace(/<b>(.*?)<\/b>/g, '**$1**');

        // Italic: <em> or <i> -> *text*
        md = md.replace(/<em>(.*?)<\/em>/g, '*$1*');
        md = md.replace(/<i>(.*?)<\/i>/g, '*$1*');

        // Lists: <li> -> * item
        md = md.replace(/<li>(.*?)<\/li>/g, '* $1\n');

        // Headers: <h1> to <h6> -> ## text
        md = md.replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/g, '\n## $1\n');

        // Links: <a href="url">text</a> -> [text](url)
        md = md.replace(/<a href="(.*?)".*?>(.*?)<\/a>/g, '[$2]($1)');

        // Line breaks: <br> -> newline
        md = md.replace(/<br\s*\/?>/g, '\n');

        // Blockquotes and Horizontal Rules
        md = md.replace(/<blockquote>([\s\S]*?)<\/blockquote>/g, '\n> $1\n');
        md = md.replace(/<hr\s*\/?>/g, '\n---\n');
        
        // Final cleanup: Use a temporary element to strip remaining HTML tags
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = md;
        let finalMd = tempDiv.innerText.trim();
        
        // Escape: Transform textual tags (like <button>) into safe text
        finalMd = finalMd.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        return finalMd;
    }

    // Main function: to download text
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

        // Create a clean clone of the message
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = msgElement.innerHTML;
        
        // Remove ANY button tag physically
        const buttons = tempDiv.querySelectorAll('button');
        buttons.forEach(btn => btn.remove());

        let content;
        let mimeType = 'text/plain';

        if (format === 'html') {
            // This removes the ENTIRE button tag, not just the text
            content = tempDiv.innerHTML; 
            mimeType = 'text/html';
        }

        else if (format === 'md') {
            // Call the utility conversion function
            content = convertToMarkdown(tempDiv.innerHTML);
            mimeType = 'text/markdown';
        }
        else {
            content = tempDiv.innerText;
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

    // Main loop: to check for new messages every 2 seconds
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
