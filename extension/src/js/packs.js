
function onPacks() {
  disableVideos()
}


function disableVideos() {
  chrome.storage.sync.get(["packDisableVideo"], (result) => {
    if (result.packDisableVideo) {
      videos = document.getElementsByTagName('video')
      for (i = 0; i < videos.length; i++) {
        videos[i].remove()
      }
    }
  });
}
