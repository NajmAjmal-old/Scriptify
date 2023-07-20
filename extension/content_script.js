chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.css) {
    const style = document.createElement('style');
    style.textContent = message.css;
    document.head.appendChild(style);
  }

  if (message.js) {
    const script = document.createElement('script');
    script.textContent = message.js;
    document.head.appendChild(script);
  }
});

// Send a message to the background script when the content script is injected.
chrome.runtime.sendMessage({ contentScriptLoaded: true });
