// Function to inject custom CSS and JS
function injectCustomCode(css, js) {
  if (css) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  if (js) {
    const script = document.createElement('script');
    script.textContent = js;
    document.head.appendChild(script);
  }
}

// Load custom JS from storage and inject it on page load
chrome.storage.sync.get('customJS', function (result) {
  const customJS = result.customJS;
  if (customJS) {
    injectCustomCode(null, customJS);
  }
});

// Listen for messages from the background script to apply custom CSS and JS
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.css || message.js) {
    injectCustomCode(message.css, message.js);

    // Save custom JS to storage
    chrome.storage.sync.set({ customJS: message.js });
  }
});
