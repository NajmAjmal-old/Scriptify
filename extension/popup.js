document.addEventListener('DOMContentLoaded', function () {
  const applyButton = document.getElementById('applyButton');
  const customCSSInput = document.getElementById('customCSS');
  const customJSInput = document.getElementById('customJS');
  const resetCSSButton = document.getElementById('resetCSS');
  const resetJSButton = document.getElementById('resetJS');
  const clearButton = document.getElementById('clearButton');

  // Load previously saved custom JS from local storage
  chrome.storage.local.get(['customJS'], function (result) {
    const savedJS = result.customJS;
    if (savedJS) {
      customJSInput.value = savedJS;
    }
  });

  applyButton.addEventListener('click', function () {
    const customCSS = customCSSInput.value;
    const customJS = customJSInput.value;

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { css: customCSS, js: customJS });
    });

    // Save custom JS to local storage
    chrome.storage.local.set({ customJS: customJS });
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
  });
});
