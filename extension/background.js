chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.css || message.js) {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      func: injectCustomCode,
      args: [message.css, message.js]
    });
  }
});

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
