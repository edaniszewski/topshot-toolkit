// Set default extension configuration option values.
chrome.storage.sync.get(null, (result) => {
  chrome.storage.sync.set({
    packDisableVideo: false,
    momentsShowChart: true,
    momentsEnableSort: true,
  });
});

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
