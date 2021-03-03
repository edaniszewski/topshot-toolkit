
function onUserPageLoad() {
  addFollow()
}


function userMetaDataExists() {
  elems = document.getElementsByClassName("ProfileInfo__StyledMetaData-sc-1bw24g7-7");
  return elems.length == 2;
}


function addFollow() {
  if (document.getElementById("tstk-follow-container") == null) {
    runAfter(userMetaDataExists, 50, 5000, once(addFollowToDOM));
  }
}


function addFollowToDOM() {
  // The element already exists.
  if (document.getElementById("tstk-follow-container") != null) {
    return;
  }

  // Normalize the username extracted from page URL.
  var username = window.location.href.split("@")[1];
  username = username.split("#")[0].split("?")[0].split("/")[0];

  chrome.storage.sync.get(["tstkFollowingUsers"], (result) => {
    var users = result.tstkFollowingUsers;
    if (users == null) {
      users = [];
    }
    users.sort();

    var wrapperList = document.getElementsByClassName("ProfileInfo__StyledMetaDataWrapper-sc-1bw24g7-13");
    var wrapper = wrapperList[0];

    var container = document.createElement("p");
    container.id = "tstk-follow-container";
    container.className = "cOlCko";
    var link = document.createElement("a");

    var img = document.createElement("img");
    img.id = "tstk-follow-img";
    img.style.width = "20px";
    img.style.height = "20px";

    var textSpan = document.createElement("span");
    textSpan.id = "tstk-follow-text"
    textSpan.style.padding = "0px 5px";

    function followUser() {
      // Add the user to tracked users, if they are not already followed.
      if (!users.includes(username)) {
        users.unshift(username);
        users.sort();
        chrome.storage.sync.set({tstkFollowingUsers: users})

        // Notify the navigation component that there was a change.
        chrome.runtime.sendMessage({
          action: "user-followed",
          user: username,
        });
      }

      // Flip the event listeners.
      link.removeEventListener("click", followUser);
      link.addEventListener("click", unfollowUser);

      // Update the elements to enable following a user.
      img.src = chrome.runtime.getURL("src/img/minus-sign-hollow.svg");
      textSpan.innerText = "Unfollow";
    }

    function unfollowUser() {
      // Remove the user to tracked users.
      if (users.includes(username)) {
        users = removeFromArray(users, username);
        users.sort();
        chrome.storage.sync.set({tstkFollowingUsers: users});

        // Notify the navigation component that there was a change.
        chrome.runtime.sendMessage({
          action: "user-unfollowed",
          user: username,
        });
      }

      // Flip the event listeners.
      link.removeEventListener("click", unfollowUser);
      link.addEventListener("click", followUser);

      // Update the elements to enable following a user.
      img.src = chrome.runtime.getURL("src/img/plus-sign-hollow.svg");
      textSpan.innerText = "Follow";
    }

    if (users == null || !users.includes(username)) {
      // The user is not being followed. Update the option to follow the user.
      img.src = chrome.runtime.getURL("src/img/plus-sign-hollow.svg");
      textSpan.innerText = "Follow";

      // When the user chooses to follow, they get added, and the option
      // changes to unfollow.
      link.addEventListener("click", followUser);

    } else {
      // The user is being followed. Update the option to unfollow the user.
      img.src = chrome.runtime.getURL("src/img/minus-sign-hollow.svg");
      textSpan.innerText = "Unfollow";

      // When the user chooses to unfollow, they get removed, and the option
      // changes to follow.
      link.addEventListener("click", unfollowUser);
    }

    link.appendChild(img)
    link.appendChild(textSpan)
    container.appendChild(link)
    wrapper.appendChild(container)
  });
}
