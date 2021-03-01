// Set default extension configuration option values.
chrome.storage.sync.get(null, (result) => {
  chrome.storage.sync.set({
    packDisableVideo: false,
    momentsShowChart: true,
    momentsEnableSort: true,
  });
});

// On these tracked events, dispatch a message so other extension components
// know the page changed. This is needed due to how top shot loads/refreshes
// page content.
var eventList = [
  'onCompleted',
  'onHistoryStateUpdated',
];
eventList.forEach(evt => {
  chrome.webNavigation[evt].addListener(e => {
    chrome.tabs.sendMessage(e.tabId, { action: "page-change" });
  },
    { url: [{ hostSuffix: "nbatopshot.com" }] });
});


chrome.runtime.onMessage.addListener(function(request, sender, send) {
  console.log('got message: %o', request)
  if (request.action == "user-followed") {
    chrome.tabs.getSelected(null, function(tab) {
      chrome.tabs.sendMessage(tab.id, {
        action: request.action,
        user: request.user,
      });
    });
  }
  else if (request.action == "user-unfollowed") {
    chrome.tabs.getSelected(null, function(tab) {
      chrome.tabs.sendMessage(tab.id, {
        action: request.action,
        user: request.user,
      });
    });
  }
});