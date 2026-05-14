console.log("Personalized Trip Planner frontend structure loaded.");

document.addEventListener("DOMContentLoaded", function () {
  initializeMobileNavigation();
  updateNavigationForLoginState();
});

// Toggles the mobile navigation menu when the Menu button is clicked.
// Expects a .nav-toggle button and a .site-nav element on the page.
// Updates the visible menu state and aria-expanded value for accessibility.
function initializeMobileNavigation() {
  const navToggleButton = document.querySelector(".nav-toggle");
  const siteNavigation = document.querySelector(".site-nav");

  if (navToggleButton && siteNavigation) {
    navToggleButton.addEventListener("click", function () {
      const isOpen = siteNavigation.classList.toggle("is-open");
      navToggleButton.setAttribute("aria-expanded", isOpen);
    });
  }
}

// Updates the shared navigation for the frontend demo login state.
// Expects window.appStorage when storage.js is loaded on a page.
// Shows a greeting and Log Out button for logged-in users.
function updateNavigationForLoginState() {
  if (!window.appStorage || !window.appStorage.isUserLoggedIn()) {
    return;
  }

  const siteNavigationList = document.querySelector(".site-nav ul");
  const currentUser = window.appStorage.getCurrentUser();

  if (!siteNavigationList || !currentUser) {
    return;
  }

  const loginLink = siteNavigationList.querySelector('a[href="login.html"], a[href="pages/login.html"]');
  const signupLink = siteNavigationList.querySelector('a[href="signup.html"], a[href="pages/signup.html"]');

  if (loginLink) {
    loginLink.textContent = "Hi, " + currentUser.firstName;
    loginLink.removeAttribute("href");
    loginLink.classList.add("nav-greeting");
  }

  if (signupLink) {
    signupLink.textContent = "Log Out";
    signupLink.removeAttribute("href");
    signupLink.classList.remove("nav-cta");
    signupLink.classList.add("logout-link");
    signupLink.setAttribute("role", "button");
    signupLink.addEventListener("click", function () {
      window.appStorage.clearCurrentUser();
      redirectAfterLogout();
    });
  }
}

// Redirects after logout using the correct relative path.
// Expects no input.
// Sends root index.html to pages/home.html and page files to home.html.
function redirectAfterLogout() {
  const isRootPage = !window.location.pathname.includes("/pages/");
  window.location.href = isRootPage ? "pages/home.html" : "home.html";
}
