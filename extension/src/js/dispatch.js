// Message routing for content-scripts actions for messages received from background
// scripts. These messages are used to synchronize actions across different context scripts,
// detect dynamic page changes, and to synchronize updates between the extension configuration
// and actions in the content-scripts.
//
// While these could be defined within each content script, defining them here in their own
// file provides a central place for message bussing. This file must be declared last in the
// manifest.json's js content_scripts.

chrome.runtime.onMessage.addListener(data => {
  if (data.action === "page-change") {
    // The navigation bar is on all pages, so update the nav on all page updates.
    // defined in `nav.js`
    updatePageNav();

    if (window.location.href.indexOf("/packs") > -1) {
      // defined in `packs.js`
      onPacksPageLoad();
    }
    else if (window.location.href.indexOf("/p2p/") > -1) {
      // defined in `moments.js`
      onMomentsPageLoad();
    }
    else if (window.location.href.indexOf("/user/") > -1) {
      // defined in `user.js`
      onUserPageLoad();
    }
  }
  else if (data.action == "user-followed") {
    // defined in `nav.js`
    addUserToNav(data.user);
  }
  else if (data.action == "user-unfollowed") {
    // defined in `nav.js`
    removeUserFromNav(data.user);
  }
});
