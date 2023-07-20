// background.js

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'saveCustomCode') {
    const { customCSS, customJS } = message;
    chrome.storage.sync.set({ customCSS, customJS }, function () {
      sendResponse({ success: true });
    });
    return true; // Indicates that the response will be sent asynchronously
  }

  if (message.action === 'loadCustomCode') {
    chrome.storage.sync.get(['customCSS', 'customJS'], function (result) {
      sendResponse({ customCSS: result.customCSS, customJS: result.customJS });
    });
    return true; // Indicates that the response will be sent asynchronously
  }
});
