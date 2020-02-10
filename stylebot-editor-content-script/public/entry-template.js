module.exports = ({
  compilation,
  webpackConfig,
  htmlWebpackPlugin: { files }
}) => {
  let strip_public_path = path => path.substr(files.publicPath.length);
  let get_asset = source =>
    compilation.assets[strip_public_path(source)].source();

  // each cssFile in htmlWebpackPlugin.files.css
  //   style !{compilation.assets[cssFile.substr(htmlWebpackPlugin.files.publicPath.length)].source()}
  // each jsFile in htmlWebpackPlugin.files.js
  //   script !{compilation.assets[jsFile.substr(htmlWebpackPlugin.files.publicPath.length)].source()}

  return `
    /* global chrome */


    chrome.extension.onRequest.addListener(async (request, sender, sendResponse) => {
      if (window !== window.top) {
        return;
      }
      if (request.name === 'toggle') {
        ${files.js
          .map(
            path => `
          await import(globalThis.dral__get_url("${path}"));
        `
          )
          .join("\n")}
      }
    })
  `;
};
