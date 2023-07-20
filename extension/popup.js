document.addEventListener('DOMContentLoaded', function () {
  const applyButton = document.getElementById('applyButton');

  applyButton.addEventListener('click', function () {
    const customCSS = document.getElementById('customCSS').value;
    const customJS = document.getElementById('customJS').value;

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { css: customCSS, js: customJS });
    });
  });
});
