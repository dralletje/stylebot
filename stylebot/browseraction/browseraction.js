document.querySelector('#open-editor-button').addEventListener('click', async () => {
  let [current_tab] = await browser.tabs.query({
    active: true,
    currentWindow: true
  });

  // TODO sendMessage ?
  chrome.tabs.sendRequest(current_tab.id, { name: 'toggle' }, function() {});

  window.close();
})

document.querySelector('#options-button').addEventListener('click', async () => {
  let [current_tab] = await browser.tabs.query({
    active: true,
    currentWindow: true
  });

  chrome.tabs.create({
    url: 'options/index.html',
    active: true
  });

  window.close();
})
