module.exports = ({
  compilation,
  webpackConfig,
  htmlWebpackPlugin: { files }
}) => {
  let strip_public_path = path => path.substr(files.publicPath.length);
  // let get_asset = source =>
  //   compilation.assets[strip_public_path(source)].source();

  return `{
    /* global chrome */

    let browser = 'browser' in window ? globalThis.browser : globalThis.chrome;
    chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
      if (window !== window.top) {
        return;
      }
      if (request.type === 'open-editor') {
        ${files.js
          .map(
            path => `
              await import(globalThis.dral__get_url("${path}"));
            `
          )
          .join("\n")}
      }
    })
  }`;
};
