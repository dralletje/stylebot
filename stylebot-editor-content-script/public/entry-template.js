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

    console.log('HEY');
    console.log(\`globalThis.browser:\`, globalThis.browser)
    console.log(\`globalThis.chrome:\`, globalThis.chrome)
    let browser = 'browser' in window ? globalThis.browser : globalThis.chrome;
    browser.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
      console.log('window !== window.top:', window !== window.top);
      console.log(\`request:\`, request)
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
