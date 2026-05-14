document.addEventListener("DOMContentLoaded", function () {
  renderMyTripsPage();
});

// Renders the My Trips page according to frontend demo login state.
// Expects window.appStorage and window.tripPackages to be available.
// Shows guest, empty, or saved trip card states.
function renderMyTripsPage() {
  if (!window.appStorage || !Array.isArray(window.tripPackages)) {
    showGuestState();
    return;
  }

  if (!window.appStorage.isUserLoggedIn()) {
    showGuestState();
    return;
  }

  const savedTripIds = window.appStorage.getSavedTripIds();
  const savedTrips = window.tripPackages.filter(function (trip) {
    return savedTripIds.includes(trip.id);
  });

  if (savedTrips.length === 0) {
    showEmptySavedTripsState();
    return;
  }

  renderSavedTripCards(savedTrips);
}

// Shows the guest state when no demo user is logged in.
// Expects no input.
// Gives links to log in, sign up, or start planning.
function showGuestState() {
  const content = document.getElementById("my-trips-content");

  if (!content) {
    return;
  }

  content.innerHTML =
    '<div class="empty-state large-empty-state">' +
      '<p class="section-label">Guest view</p>' +
      '<h2>Log in or sign up to view your saved trips.</h2>' +
      '<p>Guests can browse and get recommendations, but saved trips are only shown after demo login.</p>' +
      '<div class="modal-actions">' +
        '<a class="btn btn-primary" href="login.html">Log In</a>' +
        '<a class="btn btn-secondary" href="signup.html">Sign Up</a>' +
        '<a class="btn btn-secondary" href="preferences.html">Start Planning</a>' +
      '</div>' +
    '</div>';
}

// Shows the empty state for logged-in users with no saved trips.
// Expects no input.
// Encourages the user to start planning.
function showEmptySavedTripsState() {
  const content = document.getElementById("my-trips-content");

  if (!content) {
    return;
  }

  content.innerHTML =
    '<div class="empty-state large-empty-state">' +
      '<p class="section-label">Saved trips</p>' +
      '<h2>You have not saved any trips yet.</h2>' +
      '<p>Start by choosing your preferences and exploring trip packages.</p>' +
      '<a class="btn btn-primary" href="preferences.html">Start Planning</a>' +
    '</div>';
}

// Renders saved trip cards for the logged-in demo user.
// Expects an array of trip objects.
// Displays each saved trip with actions to view details or remove it.
function renderSavedTripCards(savedTrips) {
  const content = document.getElementById("my-trips-content");

  if (!content) {
    return;
  }

  content.innerHTML =
    '<div class="my-trips-header">' +
      '<h2>Saved Trip Packages</h2>' +
      '<p>' + savedTrips.length + ' saved trip' + (savedTrips.length === 1 ? '' : 's') + ' in this browser.</p>' +
    '</div>' +
    '<div class="my-trips-grid" id="saved-trips-grid"></div>';

  const grid = document.getElementById("saved-trips-grid");

  savedTrips.forEach(function (trip) {
    grid.appendChild(createSavedTripCard(trip));
  });
}

// Creates one saved trip card.
// Expects a trip object from window.tripPackages.
// Returns an article element with View Details and Remove actions.
function createSavedTripCard(trip) {
  const card = document.createElement("article");
  card.className = "trip-card recommendation-card saved-trip-card";

  card.innerHTML =
    '<a class="trip-card-image-link" href="trip-details.html?id=' + encodeURIComponent(trip.id) + '">' +
      '<img class="trip-card-image" src="' + trip.image + '" alt="' + trip.title + ' in ' + trip.city + ', ' + trip.country + '">' +
    '</a>' +
    '<div class="trip-card-body">' +
      '<p class="placeholder-label">' + trip.tripType + '</p>' +
      '<h2>' + trip.title + '</h2>' +
      '<p class="trip-location">' + trip.city + ', ' + trip.country + '</p>' +
      '<p>' + trip.shortDescription + '</p>' +
      '<dl class="trip-meta">' +
        '<div><dt>Price</dt><dd>$' + trip.estimatedPrice.toLocaleString() + '</dd></div>' +
        '<div><dt>Duration</dt><dd>' + trip.durationDays + ' days</dd></div>' +
        '<div><dt>Rating</dt><dd>' + trip.rating + '</dd></div>' +
      '</dl>' +
      '<div class="trip-card-actions">' +
        '<a class="btn btn-primary" href="trip-details.html?id=' + encodeURIComponent(trip.id) + '">View Details</a>' +
        '<button class="btn btn-secondary remove-trip-button" type="button">Remove</button>' +
      '</div>' +
    '</div>';

  const removeButton = card.querySelector(".remove-trip-button");
  removeButton.addEventListener("click", function () {
    removeSavedTrip(trip.id);
  });

  return card;
}

// Removes a saved trip and re-renders the My Trips page.
// Expects a trip id string.
// Updates localStorage through appStorage.
function removeSavedTrip(tripId) {
  window.appStorage.removeSavedTripById(tripId);
  renderMyTripsPage();
}
