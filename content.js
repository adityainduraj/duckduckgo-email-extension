// content.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "autofill") {
    // Wait for a short time to ensure the compose window is fully loaded
    setTimeout(() => {
      const toField = document.querySelector('input[name="to"], input[aria-label="To recipients"], input.agP');
      
      if (toField) {
        toField.value = request.email;
        toField.dispatchEvent(new Event('input', { bubbles: true }));
        toField.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Trigger focus and blur to ensure Gmail's internal handlers are triggered
        toField.focus();
        toField.blur();
        
        console.log("Autofill attempted");
      } else {
        console.log("To field not found");
      }
    }, 500);
  }
});

// Add a listener for dynamically created compose windows
const observer = new MutationObserver((mutations) => {
  for (let mutation of mutations) {
    for (let node of mutation.addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE && node.matches('div[role="dialog"][aria-label="New Message"]')) {
        console.log("New compose window detected");
      }
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });

// Log when the content script loads
console.log("DuckDuckGo Email Relay Helper content script loaded");