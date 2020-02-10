import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

import Parser from "./web-tree-sitter.js";

console.log(`Parser:`, Parser);

Parser.init().then(async () => {
  const parser = new Parser();

  const Css = await Parser.Language.load(
    globalThis.dral__get_url("web-tree-sitter/tree-sitter-css.wasm")
  );
  parser.setLanguage(Css);

  let host = window.location.host;
  let { [host]: css } = await browser.storage.local.get([host]);
  css = css || "";

  let div = document.createElement("div");
  document.body.appendChild(div);

  ReactDOM.render(
    <App
      parser={parser}
      css={css}
      onCssChange={new_css => {
        if (new_css.trim() === "") {
          browser.storage.local.set({ [host]: null });
        } else {
          browser.storage.local.set({ [host]: new_css });
        }
      }}
    />,
    div
  );
});

// Toggle unmount?

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
