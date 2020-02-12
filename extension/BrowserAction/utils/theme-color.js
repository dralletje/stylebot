console.log('theme-color');

let browser_info_promise = browser.runtime.getBrowserInfo
  ? browser.runtime.getBrowserInfo()
  : Promise.resolve({ name: "Chrome" });

let is_firefox = browser_info_promise.then(
  browser_info => browser_info.name === "Firefox"
);

export let icon_theme_color = async tab => {
  if (await is_firefox) {
    let theme = await browser.theme.getCurrent(tab.windowId);
    if (theme != null && theme.colors != null) {
      return theme.colors.icons;
    }
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "rgba(255,255,255,0.8)"
    : "black";
};
