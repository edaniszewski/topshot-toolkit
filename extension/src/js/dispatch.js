
chrome.runtime.onMessage.addListener(data => {
  if (data.action === "page-change") {
    console.log('got page change!')
    if (window.location.href.indexOf("/packs") > -1) {
      onPacks();
    }
    else if (window.location.href.indexOf("/p2p/") > -1) {
      onMoments();
    }
  }
});
