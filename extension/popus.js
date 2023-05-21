document.addEventListener('DOMContentLoaded', function() {
  var addScriptBtn = document.getElementById('add-script-btn');
  var scriptInput = document.getElementById('script-input');

  addScriptBtn.addEventListener('click', function() {
    var scriptCode = scriptInput.value;
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: injectScript,
        args: [scriptCode]
      });
    });
  });

  function injectScript(scriptCode) {
    var script = document.createElement('script');
    script.textContent = scriptCode;
    document.head.appendChild(script);
  }
});
