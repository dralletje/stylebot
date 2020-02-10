let environment = "production";
chrome.management.getSelf(({ installType }) => {
  if (installType === "development") {
    environment = "development";
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  sendResponse({ environment: environment });
});
