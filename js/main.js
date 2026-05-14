console.log("Personalized Trip Planner frontend structure loaded.");

// Toggles the mobile navigation menu when the Menu button is clicked.
// Expects a .nav-toggle button and a .site-nav element on the page.
// Updates the visible menu state and aria-expanded value for accessibility.
const navToggleButton = document.querySelector(".nav-toggle");
const siteNavigation = document.querySelector(".site-nav");

if (navToggleButton && siteNavigation) {
  navToggleButton.addEventListener("click", function () {
    const isOpen = siteNavigation.classList.toggle("is-open");
    navToggleButton.setAttribute("aria-expanded", isOpen);
  });
}
