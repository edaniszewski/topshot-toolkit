function ready(fn) {
  if (document.readyState !== "loading")
    setTimeout(fn, 1);
  else
    document.addEventListener("DOMContentLoaded", fn);
}


ready(() => {
  var optPackDisableVideo = document.getElementById("pack-disable-vid");
  var optMomentsShowChart = document.getElementById("moments-show-chart");
  var optMomentsEnableSort = document.getElementById("moments-enable-sort");

  chrome.storage.sync.get(null, (result) => {
    if (result.packDisableVideo) {
      optPackDisableVideo.checked = true;
    }
    if (result.momentsShowChart) {
      optMomentsShowChart.checked = true;
    }
    if (result.momentsEnableSort) {
      optMomentsEnableSort.checked = true;
    }
  });

  optPackDisableVideo.addEventListener("click", () => {
    chrome.storage.sync.set({ packDisableVideo: optPackDisableVideo.checked });
  });
  optMomentsShowChart.addEventListener("click", () => {
    chrome.storage.sync.set({ momentsShowChart: optMomentsShowChart.checked });
  });
  optMomentsEnableSort.addEventListener("click", () => {
    chrome.storage.sync.set({ momentsEnableSort: optMomentsEnableSort.checked });
  });


  var submenuButton = document.getElementById("submenu-button")
  var submenu = document.getElementById("submenu-select")

  submenuButton.addEventListener("click", () => {
    if (submenu.classList.contains("menuactive")) {
      submenu.classList.remove("menuactive");
    } else {
      submenu.classList.add("menuactive");
    }
  });
});