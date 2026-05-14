document.addEventListener("DOMContentLoaded", function () {
  if (!Array.isArray(window.tripPackages)) {
    showTripNotFound();
    return;
  }

  const tripId = getTripIdFromUrl();
  const trip = findTripById(tripId);

  if (!trip) {
    showTripNotFound();
    return;
  }

  renderTripDetails(trip);
  initializeSaveModal();
});

// Reads the trip id from the page URL query string.
// Expects a URL like trip-details.html?id=trip-paris-romantic.
// Returns the id string or null when no id is provided.
function getTripIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// Finds a trip package by id in the global demo data.
// Expects a trip id string.
// Returns the matching trip object or undefined.
function findTripById(tripId) {
  if (!tripId) {
    return undefined;
  }

  return window.tripPackages.find(function (trip) {
    return trip.id === tripId;
  });
}

// Renders all visible trip details for the selected package.
// Expects a trip object from window.tripPackages.
// Updates the hero, metadata, itinerary, tags, interests, and reviews.
function renderTripDetails(trip) {
  document.title = trip.title + " | Personalized Trip Planner";
  renderHero(trip);

  const content = document.getElementById("trip-details-content");

  if (!content) {
    return;
  }

  content.innerHTML =
    '<div class="trip-details-layout">' +
      '<div class="trip-main">' +
        '<section class="detail-section trip-overview-section">' +
          '<img class="trip-detail-image" src="' + trip.image + '" alt="' + trip.title + ' in ' + trip.city + ', ' + trip.country + '">' +
          '<div class="trip-detail-actions">' +
            '<button class="btn btn-primary" id="save-trip-button" type="button">Save Trip</button>' +
            '<a class="btn btn-secondary" href="recommendations.html">Back to Recommendations</a>' +
          '</div>' +
          '<p class="save-feedback" id="trip-save-feedback" aria-live="polite"></p>' +
        '</section>' +
        '<section class="detail-section">' +
          '<h2>Day-by-Day Itinerary</h2>' +
          '<div class="trip-itinerary-list">' + renderItinerary(trip.itinerary) + '</div>' +
        '</section>' +
        '<section class="detail-section">' +
          '<h2>Tags and Interests</h2>' +
          '<h3>Tags</h3>' +
          '<div class="tag-list">' + renderBadgeList(getTripTags(trip)) + '</div>' +
          '<h3>Interests</h3>' +
          '<div class="tag-list">' + renderBadgeList(trip.interests) + '</div>' +
        '</section>' +
        '<section class="detail-section">' +
          '<h2>Traveler Reviews</h2>' +
          '<div class="review-list">' + renderReviews(trip.reviews) + '</div>' +
        '</section>' +
        '<section class="detail-section">' +
          '<h2>Leave a Review</h2>' +
          '<p>Review submission will be added in a later phase.</p>' +
          '<form class="review-placeholder-form" action="#" method="post">' +
            '<div class="form-group">' +
              '<label for="review-rating">Rating</label>' +
              '<select id="review-rating" name="reviewRating" disabled>' +
                '<option value="">Select a rating</option>' +
                '<option value="5">5</option>' +
                '<option value="4">4</option>' +
                '<option value="3">3</option>' +
                '<option value="2">2</option>' +
                '<option value="1">1</option>' +
              '</select>' +
            '</div>' +
            '<div class="form-group">' +
              '<label for="review-text">Review text</label>' +
              '<textarea id="review-text" name="reviewText" rows="5" placeholder="Review submission will be enabled later." disabled></textarea>' +
            '</div>' +
            '<button class="btn btn-secondary" type="button" disabled>Submit Review</button>' +
          '</form>' +
        '</section>' +
      '</div>' +
      '<aside class="info-sidebar trip-info-sidebar">' +
        '<h2>Essential Info</h2>' +
        '<dl class="trip-detail-meta">' +
          '<div><dt>Trip type</dt><dd>' + trip.tripType + '</dd></div>' +
          '<div><dt>Estimated price</dt><dd>$' + trip.estimatedPrice.toLocaleString() + '</dd></div>' +
          '<div><dt>Duration</dt><dd>' + trip.durationDays + ' days</dd></div>' +
          '<div><dt>Group size</dt><dd>' + trip.recommendedGroupSize + '</dd></div>' +
          '<div><dt>Rating</dt><dd>' + trip.rating + ' from ' + trip.reviewCount.toLocaleString() + ' reviews</dd></div>' +
        '</dl>' +
        (trip.kosherFriendly ? '<span class="tag kosher-detail-tag">Kosher-friendly</span>' : '') +
      '</aside>' +
    '</div>';

  const saveButton = document.getElementById("save-trip-button");

  if (saveButton) {
    if (window.appStorage && window.appStorage.isTripSaved(trip.id)) {
      setTripDetailsSavedState(saveButton, "Saved to My Trips");
    }

    saveButton.addEventListener("click", function () {
      handleTripDetailsSave(trip.id, saveButton);
    });
  }
}

// Renders the top hero text for the selected trip.
// Expects a trip object.
// Updates the existing hero content container.
function renderHero(trip) {
  const hero = document.getElementById("trip-hero-content");
  const heroSection = document.querySelector(".trip-detail-hero");

  if (!hero) {
    return;
  }

  if (heroSection) {
    heroSection.style.backgroundImage = 'url("' + trip.image + '")';
  }

  hero.innerHTML =
    '<p class="section-label">' + trip.tripType + ' trip package</p>' +
    '<h1>' + trip.title + '</h1>' +
    '<p class="trip-hero-location">' + trip.city + ', ' + trip.country + '</p>' +
    '<p class="lead-text">' + trip.shortDescription + '</p>' +
    '<div class="trip-hero-meta">' +
      '<span>$' + trip.estimatedPrice.toLocaleString() + '</span>' +
      '<span>' + trip.durationDays + ' days</span>' +
      '<span>' + trip.recommendedGroupSize + '</span>' +
      '<span>' + trip.rating + ' rating (' + trip.reviewCount.toLocaleString() + ' reviews)</span>' +
      (trip.kosherFriendly ? '<span>Kosher-friendly</span>' : '') +
    '</div>';
}

// Renders itinerary day cards.
// Expects an array of itinerary day objects.
// Returns HTML markup for the itinerary list.
function renderItinerary(itinerary) {
  return itinerary.map(function (item) {
    return '<article class="itinerary-card">' +
      '<span>Day ' + item.day + '</span>' +
      '<h3>' + item.title + '</h3>' +
      '<p>' + item.description + '</p>' +
    '</article>';
  }).join("");
}

// Renders traveler review cards.
// Expects an array of review objects.
// Returns HTML markup for all reviews.
function renderReviews(reviews) {
  return reviews.map(function (review) {
    return '<article class="review-card">' +
      '<div class="review-card-header">' +
        '<h3>' + review.user + '</h3>' +
        '<span>' + review.rating + ' / 5</span>' +
      '</div>' +
      '<p>' + review.comment + '</p>' +
    '</article>';
  }).join("");
}

// Shows a friendly not-found state when the trip id is missing or invalid.
// Expects no input.
// Replaces the page content with a clear message and link back.
function showTripNotFound() {
  const hero = document.getElementById("trip-hero-content");
  const content = document.getElementById("trip-details-content");

  if (hero) {
    hero.innerHTML =
      '<p class="section-label">Trip package</p>' +
      '<h1>Trip package not found.</h1>' +
      '<p class="lead-text">The selected trip could not be found in the local demo data.</p>';
  }

  if (content) {
    content.innerHTML =
      '<div class="empty-state large-empty-state">' +
        '<h2>Trip package not found.</h2>' +
        '<p>Return to the recommendations page and choose one of the available demo trips.</p>' +
        '<a class="btn btn-primary" href="recommendations.html">Back to Recommendations</a>' +
      '</div>';
  }
}

// Opens the save placeholder modal.
// Expects no input.
// Shows login and signup actions without saving data.
function openSaveModal() {
  const modal = document.getElementById("save-modal");

  if (modal) {
    modal.hidden = false;
  }
}

// Saves the current trip for logged-in demo users or opens the guest modal.
// Expects the current trip id and Save Trip button.
// Updates localStorage only when a demo user is logged in.
function handleTripDetailsSave(tripId, saveButton) {
  if (!window.appStorage || !window.appStorage.isUserLoggedIn()) {
    openSaveModal();
    return;
  }

  window.appStorage.saveTripById(tripId);
  setTripDetailsSavedState(saveButton, "Saved to My Trips");
  showTripSaveFeedback("Trip saved to My Trips.");
}

// Updates the trip details save button after saving.
// Expects the button element and display text.
// Prevents duplicate save clicks on this page.
function setTripDetailsSavedState(button, text) {
  if (!button) {
    return;
  }

  button.textContent = text;
  button.classList.add("saved-button");
  button.disabled = true;
}

// Shows save feedback on the trip details page.
// Expects a message string.
// Writes visible feedback below the action area.
function showTripSaveFeedback(message) {
  const feedback = document.getElementById("trip-save-feedback");

  if (feedback) {
    feedback.textContent = message;
    feedback.classList.add("save-feedback--visible");
  }
}

// Closes the save placeholder modal.
// Expects no input.
// Hides the modal without saving data.
function closeSaveModal() {
  const modal = document.getElementById("save-modal");

  if (modal) {
    modal.hidden = true;
  }
}

// Connects the save modal close button and backdrop behavior.
// Expects the modal and close button to exist on the page.
// Adds event listeners without saving any trip data.
function initializeSaveModal() {
  const modal = document.getElementById("save-modal");
  const closeButton = document.getElementById("close-save-modal");

  if (closeButton) {
    closeButton.addEventListener("click", closeSaveModal);
  }

  if (modal) {
    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        closeSaveModal();
      }
    });
  }
}

// Builds the visible tag list for a trip.
// Expects one trip object.
// Returns regular tags plus Kosher-friendly when relevant.
function getTripTags(trip) {
  return trip.kosherFriendly ? trip.tags.concat("Kosher-friendly") : trip.tags;
}

// Converts a list of tag or interest names into badge markup.
// Expects an array of strings.
// Returns HTML for styled badge spans.
function renderBadgeList(items) {
  return items.map(function (item) {
    return '<span class="tag">' + item + '</span>';
  }).join("");
}
