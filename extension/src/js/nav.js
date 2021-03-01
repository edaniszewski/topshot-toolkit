
function updatePageNav() {
  addUserFollowingToNavBar();
}


function isNavBarLoaded() {
  var elems = document.getElementsByClassName("AuthenticatedActionLinks__StyledAuthenticated-sc-1u0d9pj-0");
  return elems.length == 1;
}


// Adds a navigation bar item to allow you to "follow" other users, effectively,
// this is just a convenient way of bookmarking/accessing profiles of friends or
// other users you are interested in.
function addUserFollowingToNavBar() {
  runAfter(isNavBarLoaded, 50, 5000, () => {
    if (document.getElementById("tstk-nav-follower") != null) {
      return;
    }

    var elems = document.getElementsByClassName("AuthenticatedActionLinks__StyledAuthenticated-sc-1u0d9pj-0");

    // As of this writing, the element we are looking for it the first (and only)
    // element with the given class.
    var menuWrapper = elems[0];

    // The menu wrapper needs a CSS update to accommodate for the new item being added.
    menuWrapper.style["grid-template-columns"] = "repeat(4, auto)";

    // Create the menu item.
    var menuItem = makeNavUserMenu();

    menuWrapper.appendChild(menuItem);
  });
}

function makeNavUserMenu() {
  var node = document.createElement("div");
  node.id = "tstk-nav-follower";
  node.className = " ioPkvv";

  var divNavWrapper = document.createElement('div');
  divNavWrapper.className = " jqtaQd";

  divNavWrapper.addEventListener("mouseenter", (e) => {
    divNavWrapper.style.visibility = "visible";
    divNavWrapper.style.opacity = "1";
  });
  divNavWrapper.addEventListener("mouseleave", (e) => {
    divNavWrapper.style.visibility = "hidden";
    divNavWrapper.style.opacity = "0";
  });

  var menuLink = document.createElement("a");
  menuLink["aria-label"] = "Menu"
  menuLink.href = "#"
  menuLink.className = "cLbfNm";

  node.addEventListener("mouseenter", (e) => {
    divNavWrapper.style.visibility = "visible";
    divNavWrapper.style.opacity = "1";
  });
  node.addEventListener("mouseleave", (e) => {
    divNavWrapper.style.visibility = "hidden";
    divNavWrapper.style.opacity = "0";
  });

  var img = document.createElement("img");
  img.alt = "Following";
  img.style.width = "24px";
  img.style.height = "24px";
  img.style["border-radius"] = "0";
  img.src = chrome.runtime.getURL("src/img/following.svg");
  img.className = " jfOgmq";

  var divDropdownMenu = document.createElement('div');
  divDropdownMenu.className = " ghNJSO";

  var divMenuHeader = document.createElement('div');
  divMenuHeader.style.padding = "10px 27px 8p";
  divMenuHeader.style["margin-top"] = "3px";
  divMenuHeader.innerHTML = `
      <div class="dxPQNq" style="margin-bottom: 10px;">
          <span class="jjNwrn">Bookmarked Users</span>
      </div>
  `

  var divMenuUsers = document.createElement("div");
  divMenuUsers.id = "tstk-users-container";
  divMenuUsers.className = "kZFiAx";

  chrome.storage.sync.get(["tstkFollowingUsers"], (result) => {
    var users = result.tstkFollowingUsers;
    if (users == null || users.length == 0) {
      placeholder = makeUserNavPlaceholder();
      divMenuUsers.appendChild(placeholder);

    } else {
      for (i=0;i<users.length;i++) {
        userItem = makeUserNavItem(users[i]);
        divMenuUsers.appendChild(userItem);
      }
    }
  });

  divNavWrapper.appendChild(divMenuHeader);
  divNavWrapper.appendChild(divMenuUsers);
  divDropdownMenu.appendChild(divNavWrapper);

  menuLink.appendChild(img);
  node.appendChild(menuLink);
  node.appendChild(divDropdownMenu);
  return node;
}


function makeUserNavPlaceholder() {
  var emptyDiv = document.createElement("div");
  var emptySpan = document.createElement("span");

  emptyDiv.id = "tstk-nav-placeholderuser";
  emptyDiv.style.color = "#fff";
  emptyDiv.className = "hhszpk gaQghz";
  emptySpan.className = "jjNwrn";
  emptySpan.innerText = "You have not yet bookmarked any users";

  emptyDiv.appendChild(emptySpan);
  return emptyDiv;
}

function makeUserNavItem(username) {
  var usrLink = document.createElement("a")
  var usrDiv = document.createElement("div")
  var usrSpan = document.createElement("span")

  usrLink.href = "/user/@"+username;
  usrLink.id = "tstk-nav-user-"+username;

  usrDiv.style.color = "#fff";
  usrDiv.className = "hhszpk gaQghz";
  usrSpan.className = "jjNwrn";
  usrSpan.innerText = username;

  usrDiv.appendChild(usrSpan);
  usrLink.appendChild(usrDiv);
  return usrLink;
}


function removeUserFromNav(user) {
  var container = document.getElementById("tstk-users-container");

  var userItem = document.getElementById("tstk-nav-user-"+user);
  if (userItem != null) {
    userItem.remove();
  }

  if (container.children.length == 0) {
    container.appendChild(makeUserNavPlaceholder());
  }
}

function addUserToNav(user) {
  var container = document.getElementById("tstk-users-container");

  var placeholder = document.getElementById("tstk-nav-placeholderuser");
  if (placeholder != null) {
    placeholder.remove();
  }
  container.appendChild(makeUserNavItem(user));
}