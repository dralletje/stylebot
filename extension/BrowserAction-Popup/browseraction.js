document.querySelector('#open-editor-button').addEventListener('click', async () => {
  let [current_tab] = await browser.tabs.query({
    active: true,
    currentWindow: true
  });

  // TODO sendMessage ?
  // chrome.tabs.sendRequest(current_tab.id, { name: 'toggle' }, function() {});
  console.log('Yes')
  console.log(`current_tab.id:`, current_tab.id)
  browser.tabs.sendMessage(current_tab.id, { type: "open-editor" }, (response) => {});

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
