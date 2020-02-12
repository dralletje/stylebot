import { tint_image } from "./utils/tint-image.js";
import { icon_theme_color } from "./utils/theme-color.js";

let apply_browser_action = async (tabId, action) => {
  await browser.browserAction.setIcon({
    tabId: tabId,
    imageData: action.icon
  });
  await browser.browserAction.setTitle({
    tabId: tabId,
    title: action.title
  });
};

let update_button_on_tab = async tab => {
  if (
    tab.url.match(/^about:/) ||
    tab.url.match(/^chrome:\/\//) ||
    tab.url.match(/^https?:\/\/chrome.google.com/)
  ) {
    await apply_browser_action(tab.id, {
      icon: await tint_image(
        `/BrowserAction/Images/Brush@2x.png`,
        "rgba(208, 2, 27, .22)"
      ),
      title: "For security reasons, Brush is not supported on this url."
    });
    return;
  }

  let host = new URL(tab.url).host;
  let { [host]: css } = await browser.storage.local.get([host]);

  if (css) {
    let icon_color = await icon_theme_color();
    await apply_browser_action(tab.id, {
      icon: await tint_image(`/BrowserAction/Images/Brush@2x.png`, icon_color),
      title: "Brush is doing it's best make your page all fancy."
    });
  } else {
    await apply_browser_action(tab.id, {
      icon: await tint_image(
        `/BrowserAction/Images/Brush@2x.png`,
        "rgba(133, 133, 133, 0.5)"
      ),
      title: "Brush is not applying any custom styles."
    });
  }
};

(async () => {
  let all_tabs = await browser.tabs.query({});
  for (let tab of all_tabs) {
    await update_button_on_tab(tab);
  }
})();
browser.tabs.onUpdated.addListener(async (tabId, changed, tab) => {
  if (changed.url != null || changed.status != null) {
    await update_button_on_tab(tab);
  }
});
