chrome.runtime.sendMessage({ command: "get-environment" }, (response) => {
  // globalThis.dral__get_url = (path) => chrome.runtime.getURL('build-stylebot-editor-content-script/' + path);

  if (response.environment === 'development') {
    globalThis.dral__get_url = (path) => `http://localhost:3000/${path}`;
  } else {
    globalThis.dral__get_url = (path) => chrome.runtime.getURL(path);
  }

  import(globalThis.dral__get_url('entry.js'))
  // .catch(err => {
  //   import(chrome.runtime.getURL('entry.js'));
  // });
});
