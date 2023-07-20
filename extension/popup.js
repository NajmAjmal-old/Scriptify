document.addEventListener('DOMContentLoaded', function () {
  const applyButton = document.getElementById('applyButton');
  const customCSSInput = document.getElementById('customCSS');
  const customJSInput = document.getElementById('customJS');
  const resetCSSButton = document.getElementById('resetCSS');
  const resetJSButton = document.getElementById('resetJS');
  const clearButton = document.getElementById('clearButton');

  // Load previously saved custom CSS and JS from storage
  chrome.storage.sync.get(['customCSS', 'customJS'], function (result) {
    if (result.customCSS) {
      customCSSInput.value = result.customCSS;
    }
    if (result.customJS) {
      customJSInput.value = result.customJS;
    }
  });

  applyButton.addEventListener('click', function () {
    const customCSS = customCSSInput.value;
    const customJS = customJSInput.value;

    // Save custom CSS and JS to storage
    chrome.storage.sync.set({ customCSS, customJS }, function () {
      // Inform the user that the changes are applied
      alert('Custom CSS and JS applied successfully!');
    });

    // Inject custom CSS and JS as content scripts
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: injectCustomCode,
        args: [customCSS, customJS],
      });
    });
  });

  resetCSSButton.addEventListener('click', function () {
    customCSSInput.value = '';
  });

  resetJSButton.addEventListener('click', function () {
    customJSInput.value = '';
  });

  clearButton.addEventListener('click', function () {
    customCSSInput.value = '';
    customJSInput.value = '';

    // Clear custom CSS and JS from storage
    chrome.storage.sync.clear();
  });
});
