
function onPacksPageLoad() {
  disableVideos()
}


function disableVideos() {
  chrome.storage.sync.get(["packDisableVideo"], (result) => {
    if (result.packDisableVideo) {
      // Wait a short period of time before attempting to remove videos, so the page
      // content has time to load.
      setTimeout(() => {
        videos = document.getElementsByTagName('video')
        for (i = 0; i < videos.length; i++) {
          videos[i].remove()
        }
      }, 1000);
    }
  });
}
