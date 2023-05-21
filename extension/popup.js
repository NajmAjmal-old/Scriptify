document.addEventListener('DOMContentLoaded', function() {
  const featureDropdown = document.getElementById('feature-dropdown');
  const siteSelector = document.getElementById('site-selector');
  const addWebsiteSection = document.getElementById('add-website');
  const scriptEditor = document.getElementById('script-editor');
  const siteSelect = document.getElementById('site-select');
  const editScriptBtn = document.getElementById('edit-script-btn');
  const addWebsiteBtn = document.getElementById('add-website-btn');
  const scriptInput = document.getElementById('script-input');
  const darkModeToggle = document.getElementById('darkModeToggle');
  const stylesheet = document.getElementById('stylesheet');

  featureDropdown.addEventListener('change', function() {
    const selectedFeature = featureDropdown.value;
    hideAllSections();
    if (selectedFeature === 'edit') {
      showSection(siteSelector);
      populateSiteSelector();
    } else if (selectedFeature === 'add') {
      showSection(addWebsiteSection);
    } else if (selectedFeature === 'settings') {
      showSection(document.getElementById('settings'));
    }
  });

  siteSelect.addEventListener('change', function() {
    const selectedSite = siteSelect.value;
    loadSavedScript(selectedSite);
  });

  editScriptBtn.addEventListener('click', function() {
    const selectedSite = siteSelect.value;
    const scriptCode = scriptInput.value;
    saveScript(selectedSite, scriptCode);
    executeScript(selectedSite, scriptCode);
  });

  addWebsiteBtn.addEventListener('click', function() {
    const websiteUrl = document.getElementById('website-input').value;
    if (websiteUrl) {
      const selectedSite = getHostname(websiteUrl);
      addWebsiteToSelect(selectedSite);
      featureDropdown.value = 'edit';
      hideAllSections();
      showSection(siteSelector);
      siteSelect.value = selectedSite;
      loadSavedScript(selectedSite);
    }
  });

  darkModeToggle.addEventListener('change', function() {
    if (darkModeToggle.checked) {
      stylesheet.href = 'dark-mode.css';
    } else {
      stylesheet.href = 'light-mode.css';
    }
  });

  function hideAllSections() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(function(section) {
      section.classList.add('hidden');
    });
  }

  function showSection(section) {
    section.classList.remove('hidden');
  }

  function populateSiteSelector() {
    chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
      const tab = tabs[0];
      const selectedSite = getHostname(tab.url);
      if (selectedSite) {
        siteSelect.value = selectedSite;
        loadSavedScript(selectedSite);
      }
    });
  }

  function addWebsiteToSelect(site) {
    const option = document.createElement('option');
    option.value = site;
    option.textContent = site;
    siteSelect.appendChild(option);
  }

  function getHostname(url) {
    const hostname = new URL(url).hostname;
    return hostname.startsWith('www.') ? hostname.substring(4) : hostname;
  }

  function loadSavedScript(site) {
    chrome.storage.sync.get('scripts', function(data) {
      const scripts = data.scripts || {};
      const scriptCode = scripts[site] || '';
      scriptInput.value = scriptCode;
    });
  }

  function saveScript(site, scriptCode) {
    chrome.storage.sync.get('scripts', function(data) {
      const scripts = data.scripts || {};
      scripts[site] = scriptCode;
      chrome.storage.sync.set({ 'scripts': scripts });
    });
  }

  function executeScript(site, scriptCode) {
    chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
      const tab = tabs[0];
      chrome.tabs.executeScript(tab.id, { code: scriptCode });
    });
  }
});
