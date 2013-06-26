// Update the extension browser action
var BrowserAction = {
  /**
   * Update browser action for the specified tab to indicate:
   *   - stylebot is not visible
   *   - No CSS is applied to the current page
   * @param {object} tab The tab for which the browser action should be updated
   */
  unhighlight: function(tab) {
    chrome.browserAction.setIcon({
      tabId: tab.id,
      path: {
        '19': 'images/css.png',
        '38': 'images/css@2x.png'
      }
    });
  },

  /**
   * Update browser action for the specified tab to indicate:
   *   - stylebot is not visible
   *   - CSS is applied to the current page
   * @param {object} tab The tab for which the browser action should be updated
   */
  highlight: function(tab) {
    chrome.browserAction.setIcon({
      tabId: tab.id,
      path: {
        '19': 'images/css_highlighted.png',
        '38': 'images/css_highlighted@2x.png'
      }
    });
  },

  /**
   * Update browser action for the specified tab to indicate:
   *   - stylebot is visible
   * @param {object} tab The tab for which the browser action should be updated
   */
  activate: function(tab) {
    chrome.browserAction.setIcon({
      tabId: tab.id,
      path: {
        '19': 'images/css_active.png',
        '38': 'images/css_active@2x.png'
      }
    });
  },

  /**
   * Update the browser action for the specified tab.
   * @param {Object} tab The tab for which to update the browser action.
   */
  update: function(tab) {
    if (tab.url.isValidUrl()) {
      var response = cache.loadingTabs[tab.id];
      var stylingApplied = false;

      if (response && (response.rules ||
         (response.global && !isEmptyObject(response.global)))) {
        stylingApplied = true;
      }

      if (stylingApplied) {
        BrowserAction.highlight(tab);
      } else {
        BrowserAction.unhighlight(tab);
      }
    } else {
      BrowserAction.disable(tab.id);
    }
  },

  disable: function(tabId) {
    chrome.browserAction.disable(tabId);
  }
}