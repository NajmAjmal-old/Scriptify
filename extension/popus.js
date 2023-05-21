document.addEventListener('DOMContentLoaded', function() {
  var featureDropdown = document.getElementById('feature-dropdown');
  var siteSelector = document.getElementById('site-selector');
  var scriptEditor = document.getElementById('script-editor');
  var siteSelect = document.getElementById('site-select');
  var editScriptBtn = document.getElementById('edit-script-btn');
  var scriptInput = document.getElementById('script-input');

  featureDropdown.addEventListener('change', function() {
    var selectedFeature = featureDropdown.value;
    hideAllSections();
    if (selectedFeature === 'edit') {
      showSection(siteSelector);
      loadSavedScripts(siteSelect.value);
    } else if (selectedFeature === 'add') {
      showSection(scriptEditor);
    } else if (selectedFeature === 'settings') {
      showSection(document.getElementById('settings'));
    }
  });

  siteSelect.addEventListener('change', function() {
    loadSavedScripts(siteSelect.value);
  });

  editScriptBtn.addEventListener('click', function() {
    var site = siteSelect.value;
    var scriptCode = scriptInput.value;
    saveScript(site, scriptCode);
    chrome.tabs.executeScript({ code: scriptCode });
  });

  function hideAllSections() {
    var sections = document.querySelectorAll('.section');
    sections.forEach(function(section) {
      section.classList.add('hidden');
    });
  }

  function showSection(section) {
    section.classList.remove('hidden');
  }

  function loadSavedScripts(site) {
    chrome.storage.sync.get('scripts', function(data) {
      var scripts = data.scripts || {};
      var scriptCode = scripts[site] || '';
      scriptInput.value = scriptCode;
    });
  }

  function saveScript(site, scriptCode) {
    chrome.storage.sync.get('scripts', function(data) {
      var scripts = data.scripts || {};
      scripts[site] =
