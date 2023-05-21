document.addEventListener('DOMContentLoaded', function() {
  var addScriptBtn = document.getElementById('add-script-btn');
  var editScriptBtn = document.getElementById('edit-script-btn');
  var scriptInput = document.getElementById('script-input');
  var siteSelect = document.getElementById('site-select');

  // Load saved scripts for the selected website
  chrome.storage.sync.get('scripts', function(data) {
    var scripts = data.scripts || {};
    populateSiteSelect(scripts);
    loadCurrentScripts(scripts[siteSelect.value]);
  });

  // Populate the site selector dropdown
  function populateSiteSelect(scripts) {
    var optionsHtml = '';
    Object.keys(scripts).forEach(function(site) {
      optionsHtml += `<option value="${site}">${site}</option>`;
    });
    siteSelect.innerHTML = optionsHtml;
  }

  // Load the currently active website scripts
  function loadCurrentScripts(existingScript) {
    chrome.scripting.executeScript(
      {
        target: { tabId: currentTab.id },
        function: getLoadedScripts
      },
      function(results) {
        var loadedScripts = results[0].result;
        if (existingScript) {
          loadedScripts.push(existingScript);
        }
        scriptInput.value = loadedScripts.join('\n');
      }
    );
  }

  // Handle script addition
  addScriptBtn.addEventListener('click', function() {
    var site = siteSelect.value;
    var scriptCode = scriptInput.value;
    var newScriptFile = `custom_script_${Date.now()}.js`;
    var newScriptUrl = chrome.runtime.getURL(newScriptFile);
    var customScript = `
      var s = document.createElement('script');
      s.src = '${newScriptUrl}';
      document.head.appendChild(s);
    `;
    scriptInput.value = scriptCode + '\n' + customScript;
    saveScript(site, scriptCode, newScriptFile);
    chrome.tabs.executeScript({ code: scriptCode });
  });

  // Handle script editing
  editScriptBtn.addEventListener('click', function() {
    var site = siteSelect.value;
    var scriptCode = scriptInput.value;
    saveScript(site, scriptCode);
    chrome.tabs.executeScript({ code: scriptCode });
  });

  // Save the script for the selected website
  function saveScript(site, scriptCode, newScriptFile) {
    chrome.storage.sync.get('scripts', function(data) {
      var scripts = data.scripts || {};
      scripts[site] = newScriptFile;
      chrome.storage.sync.set({ 'scripts': scripts }, function() {
        populateSiteSelect(scripts);
      });
      if (newScriptFile) {
        chrome.runtime.sendMessage({ scriptFile: newScriptFile, scriptCode: scriptCode });
      }
    });
  }

  // Get the current active tab
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    currentTab = tabs[0];
  });
});

// Listen for message from the popup to create a new script file
chrome.runtime.onMessage.addListener(function(request) {
  if
