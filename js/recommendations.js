document.addEventListener("DOMContentLoaded", function () {
  if (!Array.isArray(window.tripPackages)) {
    showEmptyState("Trip data is not available yet.");
    return;
  }

  initializeRecommendationFilters();
  applyFilters();
  initializeSaveModal();
});

// Reads temporary trip preferences saved by the Preferences form.
// Expects sessionStorage to contain a tripPreferences JSON value, if available.
// Returns the parsed preferences object or null.
function getStoredPreferences() {
  const storedPreferences = sessionStorage.getItem("tripPreferences");

  if (!storedPreferences) {
    return null;
  }

  try {
    return JSON.parse(storedPreferences);
  } catch (error) {
    return null;
  }
}

// Reads the current recommendation filter controls.
// Expects the filter controls to exist on recommendations.html.
// Returns a simple filters object used by applyFilters.
function getCurrentFilters() {
  const selectedInterestInputs = document.querySelectorAll('input[name="filterInterests"]:checked');

  return {
    tripType: getElementValue("filter-trip-type"),
    maxBudget: Number(getElementValue("filter-budget")) || null,
    maxDuration: Number(getElementValue("filter-duration")) || null,
    kosherOnly: Boolean(document.getElementById("filter-kosher") && document.getElementById("filter-kosher").checked),
    interests: Array.from(selectedInterestInputs).map(function (input) {
      return input.value;
    })
  };
}

// Applies hard filters first and then sorts matching trips by a simple score.
// Expects trip data from window.tripPackages and current filter controls.
// Renders the matching cards and updates the result message.
function applyFilters() {
  const filters = getCurrentFilters();
  const storedPreferences = getStoredPreferences();
  const hasPreferences = Boolean(storedPreferences);
  const hasActiveFilters = hasAnyActiveFilter(filters);

  let hardFilteredTrips = window.tripPackages.filter(function (trip) {
    return passesHardFilters(trip, filters);
  });

  if (hardFilteredTrips.length === 0) {
    showEmptyState("No trips match your current filters. Try increasing your budget, duration, or clearing filters.");
    updateResultsMessage("No trips match your current filters.");
    return;
  }

  const scoredTrips = hardFilteredTrips
    .map(function (trip) {
      return {
        trip: trip,
        score: scoreTrip(trip, filters)
      };
    })
    .sort(function (first, second) {
      return second.score - first.score || second.trip.rating - first.trip.rating;
    });

  const bestScore = scoredTrips[0] ? scoredTrips[0].score : 0;
  const visibleTrips = scoredTrips
    .filter(function (item) {
      return bestScore === 0 || item.score > 0;
    })
    .map(function (item) {
      return item.trip;
    });

  if (visibleTrips.length === 0) {
    showEmptyState("No trips match your current filters. Try increasing your budget, duration, or clearing filters.");
    updateResultsMessage("No trips match your current filters.");
    return;
  }

  renderTripCards(visibleTrips);

  if (!hasPreferences && !hasActiveFilters) {
    updateResultsMessage("Showing all available trip packages. Start from Plan a Trip for personalized results.");
  } else if (bestScore === 0) {
    updateResultsMessage("Showing available trips that fit your budget, duration, and kosher preference.");
  } else {
    updateResultsMessage("Showing " + visibleTrips.length + " trip package" + (visibleTrips.length === 1 ? "" : "s") + " based on your current filters.");
  }
}

// Gives each trip a beginner-friendly match score.
// Expects one trip object and the current filters.
// Returns a number where higher means a better match.
function scoreTrip(trip, filters) {
  let score = 0;

  if (!filters.tripType && filters.interests.length === 0) {
    return 1;
  }

  if (filters.tripType && trip.tripType === filters.tripType) {
    score += 4;
  }

  filters.interests.forEach(function (interest) {
    if (trip.interests.includes(interest)) {
      score += 2;
    }
  });

  if (filters.maxBudget && trip.estimatedPrice <= filters.maxBudget) {
    score += 1;
  }

  if (filters.maxDuration && trip.durationDays <= filters.maxDuration) {
    score += 1;
  }

  if (filters.kosherOnly && trip.kosherFriendly) {
    score += 1;
  }

  return score;
}

// Renders trip cards into the recommendations grid.
// Expects an array of trip package objects.
// Clears the grid and appends one card for each trip.
function renderTripCards(trips) {
  const grid = document.getElementById("recommendations-grid");

  if (!grid) {
    return;
  }

  grid.innerHTML = "";

  trips.forEach(function (trip) {
    grid.appendChild(createTripCard(trip));
  });
}

// Creates one accessible recommendation card.
// Expects a trip package object from window.tripPackages.
// Returns an article element ready to be inserted into the page.
function createTripCard(trip) {
  const card = document.createElement("article");
  card.className = "trip-card recommendation-card";

  const detailsUrl = "trip-details.html?id=" + encodeURIComponent(trip.id);

  card.innerHTML =
    '<a class="trip-card-image-link" href="' + detailsUrl + '">' +
      '<img class="trip-card-image" src="' + trip.image + '" alt="' + trip.title + ' in ' + trip.city + ', ' + trip.country + '">' +
    '</a>' +
    '<div class="trip-card-body">' +
      '<div class="trip-card-heading">' +
        '<p class="placeholder-label">' + trip.tripType + '</p>' +
        '<h2>' + trip.title + '</h2>' +
        '<p class="trip-location">' + trip.city + ', ' + trip.country + '</p>' +
      '</div>' +
      '<p>' + trip.shortDescription + '</p>' +
      '<div class="tag-list">' + createTagsMarkup(trip) + '</div>' +
      '<dl class="trip-meta">' +
        '<div><dt>Price</dt><dd>$' + trip.estimatedPrice.toLocaleString() + '</dd></div>' +
        '<div><dt>Duration</dt><dd>' + trip.durationDays + ' days</dd></div>' +
        '<div><dt>Group</dt><dd>' + trip.recommendedGroupSize + '</dd></div>' +
        '<div><dt>Rating</dt><dd>' + trip.rating + ' (' + trip.reviewCount.toLocaleString() + ' reviews)</dd></div>' +
      '</dl>' +
      '<div class="trip-card-actions">' +
        '<a class="btn btn-primary" href="' + detailsUrl + '">View Details</a>' +
        '<button class="btn btn-secondary save-trip-button" type="button">Save</button>' +
      '</div>' +
    '</div>';

  const saveButton = card.querySelector(".save-trip-button");
  saveButton.addEventListener("click", openSaveModal);

  return card;
}

// Updates the visible results status text.
// Expects a short status message string.
// Writes the message to the results status area.
function updateResultsMessage(message) {
  const status = document.getElementById("results-status");

  if (status) {
    status.textContent = message;
  }
}

// Shows a readable empty state in the recommendations grid.
// Expects the message to display to the user.
// Clears any previous cards before adding the empty state.
function showEmptyState(message) {
  const grid = document.getElementById("recommendations-grid");

  if (!grid) {
    return;
  }

  grid.innerHTML =
    '<div class="empty-state recommendations-empty-state">' +
      '<h2>No matching trips</h2>' +
      '<p>' + message + '</p>' +
      '<a class="btn btn-secondary" href="preferences.html">Update Preferences</a>' +
    '</div>';
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

// Closes the save placeholder modal.
// Expects no input.
// Hides the modal without saving data.
function closeSaveModal() {
  const modal = document.getElementById("save-modal");

  if (modal) {
    modal.hidden = true;
  }
}

// Initializes filter controls from sessionStorage preferences when available.
// Expects filter controls to exist on the Recommendations page.
// Adds change/input listeners so cards update immediately.
function initializeRecommendationFilters() {
  const storedPreferences = getStoredPreferences();
  const tripTypeSelect = document.getElementById("filter-trip-type");
  const budgetInput = document.getElementById("filter-budget");
  const durationInput = document.getElementById("filter-duration");
  const kosherInput = document.getElementById("filter-kosher");
  const clearButton = document.getElementById("clear-filters-button");
  const filterControls = document.querySelectorAll("#filter-trip-type, #filter-budget, #filter-duration, #filter-kosher, input[name='filterInterests']");

  if (storedPreferences) {
    if (tripTypeSelect) {
      tripTypeSelect.value = storedPreferences.tripType || "";
    }

    if (budgetInput) {
      budgetInput.value = storedPreferences.budget || "";
    }

    if (durationInput) {
      durationInput.value = storedPreferences.durationDays || "";
    }

    if (kosherInput) {
      kosherInput.checked = Boolean(storedPreferences.kosherFriendly);
    }

    if (Array.isArray(storedPreferences.interests)) {
      storedPreferences.interests.forEach(function (interest) {
        const interestInput = document.querySelector('input[name="filterInterests"][value="' + interest + '"]');

        if (interestInput) {
          interestInput.checked = true;
        }
      });
    }
  }

  filterControls.forEach(function (control) {
    control.addEventListener("change", applyFilters);
    control.addEventListener("input", applyFilters);
  });

  if (clearButton) {
    clearButton.addEventListener("click", function () {
      clearRecommendationFilters();
      sessionStorage.removeItem("tripPreferences");
      applyFilters();
    });
  }
}

// Wires the close behavior for the save placeholder modal.
// Expects modal elements to exist on recommendations.html.
// Adds click listeners for the close button and backdrop.
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

function passesHardFilters(trip, filters) {
  if (filters.maxBudget && trip.estimatedPrice > filters.maxBudget) {
    return false;
  }

  if (filters.maxDuration && trip.durationDays > filters.maxDuration) {
    return false;
  }

  if (filters.kosherOnly && !trip.kosherFriendly) {
    return false;
  }

  return true;
}

function hasAnyActiveFilter(filters) {
  return Boolean(filters.tripType || filters.maxBudget || filters.maxDuration || filters.kosherOnly || filters.interests.length > 0);
}

function createTagsMarkup(trip) {
  const tags = trip.kosherFriendly ? trip.tags.concat("Kosher-friendly") : trip.tags;

  return tags.map(function (tag) {
    return '<span class="tag">' + tag + '</span>';
  }).join("");
}

function clearRecommendationFilters() {
  const tripTypeSelect = document.getElementById("filter-trip-type");
  const budgetInput = document.getElementById("filter-budget");
  const durationInput = document.getElementById("filter-duration");
  const kosherInput = document.getElementById("filter-kosher");
  const interestInputs = document.querySelectorAll('input[name="filterInterests"]');

  if (tripTypeSelect) {
    tripTypeSelect.value = "";
  }

  if (budgetInput) {
    budgetInput.value = "";
  }

  if (durationInput) {
    durationInput.value = "";
  }

  if (kosherInput) {
    kosherInput.checked = false;
  }

  interestInputs.forEach(function (input) {
    input.checked = false;
  });
}

function getElementValue(elementId) {
  const element = document.getElementById(elementId);
  return element ? element.value.trim() : "";
}
