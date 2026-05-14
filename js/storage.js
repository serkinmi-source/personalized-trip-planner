// Frontend-only demo storage helpers for login state and saved trip ids.
// This is not real authentication and must not store passwords.
const CURRENT_USER_KEY = "currentUser";
const SAVED_TRIPS_KEY = "savedTrips";

// Safely reads JSON data from localStorage.
// Expects a localStorage key and a fallback value.
// Returns parsed data or the fallback when data is missing or invalid.
function readStorageValue(key, fallbackValue) {
  const storedValue = localStorage.getItem(key);

  if (!storedValue) {
    return fallbackValue;
  }

  try {
    return JSON.parse(storedValue);
  } catch (error) {
    return fallbackValue;
  }
}

// Gets the current demo user from localStorage.
// Expects no input.
// Returns the user object or null.
function getCurrentUser() {
  return readStorageValue(CURRENT_USER_KEY, null);
}

// Stores the current demo user in localStorage.
// Expects a simple user object with isLoggedIn, firstName, and email.
// Produces a persisted frontend-only login state.
function setCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

// Clears the current demo user from localStorage.
// Expects no input.
// Logs the user out for the frontend demo.
function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

// Checks whether a demo user is currently logged in.
// Expects no input.
// Returns true only when currentUser has isLoggedIn set to true.
function isUserLoggedIn() {
  const currentUser = getCurrentUser();
  return Boolean(currentUser && currentUser.isLoggedIn);
}

// Gets saved trip ids from localStorage.
// Expects no input.
// Returns an array of trip id strings.
function getSavedTripIds() {
  const savedTripIds = readStorageValue(SAVED_TRIPS_KEY, []);
  return Array.isArray(savedTripIds) ? savedTripIds : [];
}

// Saves a trip id if it is not already saved.
// Expects a trip id string.
// Updates localStorage and returns the full saved id array.
function saveTripById(tripId) {
  const savedTripIds = getSavedTripIds();

  if (!savedTripIds.includes(tripId)) {
    savedTripIds.push(tripId);
    localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(savedTripIds));
  }

  return savedTripIds;
}

// Removes a trip id from saved trips.
// Expects a trip id string.
// Updates localStorage and returns the remaining saved id array.
function removeSavedTripById(tripId) {
  const savedTripIds = getSavedTripIds().filter(function (savedTripId) {
    return savedTripId !== tripId;
  });

  localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(savedTripIds));
  return savedTripIds;
}

// Checks whether a trip id is already saved.
// Expects a trip id string.
// Returns true when the trip id is stored in savedTrips.
function isTripSaved(tripId) {
  return getSavedTripIds().includes(tripId);
}

// Clears all saved trips from localStorage.
// Expects no input.
// Removes the savedTrips key.
function clearSavedTrips() {
  localStorage.removeItem(SAVED_TRIPS_KEY);
}

window.appStorage = {
  getCurrentUser: getCurrentUser,
  setCurrentUser: setCurrentUser,
  clearCurrentUser: clearCurrentUser,
  isUserLoggedIn: isUserLoggedIn,
  getSavedTripIds: getSavedTripIds,
  saveTripById: saveTripById,
  removeSavedTripById: removeSavedTripById,
  isTripSaved: isTripSaved,
  clearSavedTrips: clearSavedTrips
};
