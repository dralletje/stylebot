let URL_DEVELOPMENT = (path) => `http://localhost:3000/${path}`;
let URL_PRODUCTION = (path) => chrome.runtime.getURL(`/build-stylebot-editor-content-script/${path}`);

chrome.runtime.sendMessage({ command: "get-environment" }, (response) => {
  // globalThis.dral__get_url = (path) => chrome.runtime.getURL('build-stylebot-editor-content-script/' + path);

  globalThis.dral__get_url = response.environment === 'development' ? URL_DEVELOPMENT : URL_PRODUCTION;

  import(globalThis.dral__get_url('entry.js'))
  .catch(err => {
    // If my local development server is not running,
    // get it from the local extension
    globalThis.dral__get_url = URL_PRODUCTION;
    import(globalThis.dral__get_url('entry.js'));
  });

});

// setTimeout(() => {
//   let iframe = document.createElement('iframe');
//   iframe.src = "http://localhost:3000/index.html"
//   document.body.append(iframe)
// }, 1000)
