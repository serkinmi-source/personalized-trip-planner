# Personalized Trip Planner

Personalized Trip Planner is a frontend-only university web course project. It is an English-language travel planning website that recommends trip packages based on user preferences.

Users can browse as guests, fill in trip preferences, view recommendation cards, open trip details, and try to save trips. Guests can view recommendations and details, but saving trips requires the demo login/signup state.

## Current Status

This project is currently a client-side demo built with:

- HTML
- CSS
- Vanilla JavaScript
- `sessionStorage`
- `localStorage`
- Local demo data
- Local image files

No backend, database, framework, or external UI library is used.

## Main Features

- Shared header, navigation, and footer across all pages.
- Responsive Home page with travel hero, feature cards, how-it-works section, and travel style cards.
- Login and signup forms with client-side validation.
- Preferences form with client-side validation.
- Preferences are stored temporarily in `sessionStorage` before showing recommendations.
- Recommendations page renders 20 local demo trip packages from `js/data.js`.
- Client-side filters for trip type, budget, duration, kosher-friendly trips, and interests.
- Trip details page renders dynamically by URL id, for example:
  `pages/trip-details.html?id=trip-paris-romantic`
- Frontend-only demo login state using `localStorage`.
- Logged-in users can save trips to My Trips.
- My Trips page renders saved trips and supports removing them.
- Local real image files are used for trip cards and hero backgrounds.

## Project Structure

```text
personalized-trip-planner/
|-- AGENTS.md
|-- README.md
|-- index.html
|-- pages/
|   |-- home.html
|   |-- login.html
|   |-- signup.html
|   |-- preferences.html
|   |-- recommendations.html
|   |-- trip-details.html
|   `-- my-trips.html
|-- css/
|   `-- style.css
|-- js/
|   |-- main.js
|   |-- data.js
|   |-- validation.js
|   |-- storage.js
|   |-- recommendations.js
|   |-- tripDetails.js
|   `-- myTrips.js
`-- assets/
    `-- images/
        |-- IMAGE-CREDITS.md
        |-- backgrounds/
        `-- trips/
```

`index.html` is the root entry point. Full website pages are inside the `pages/` folder.

## Pages

- `index.html` - Root entry page that links into the site.
- `pages/home.html` - Main landing page.
- `pages/preferences.html` - Trip preferences form.
- `pages/recommendations.html` - Dynamic recommendation cards and filters.
- `pages/trip-details.html` - Dynamic trip details by query string id.
- `pages/login.html` - Demo login form.
- `pages/signup.html` - Demo signup form.
- `pages/my-trips.html` - Saved trips for logged-in demo users.

## JavaScript Files

- `js/main.js` - Shared UI behavior, mobile navigation, login greeting, and logout.
- `js/data.js` - Local demo data for 20 trip packages.
- `js/validation.js` - Login, signup, and preferences form validation.
- `js/storage.js` - Helper functions for demo login state and saved trips.
- `js/recommendations.js` - Recommendation filtering, rendering, and save behavior.
- `js/tripDetails.js` - Dynamic trip details rendering by URL id.
- `js/myTrips.js` - My Trips rendering and remove behavior.

## Local Storage and Session Storage

The project uses browser storage only for frontend demo behavior.

`sessionStorage`:

- `tripPreferences` - Temporary preferences used to initialize recommendation filters.

`localStorage`:

- `currentUser` - Demo login state. Passwords are not stored.
- `savedTrips` - Array of saved trip ids.

This is not real authentication.

## Images

Trip images are stored locally in:

```text
assets/images/trips/
```

Background images are stored locally in:

```text
assets/images/backgrounds/
```

Image documentation and credit tracking are in:

```text
assets/images/IMAGE-CREDITS.md
```

Do not use external image URLs in the final demo.

## How to Run

This is a static frontend project. No installation is required.

Open this file in a browser:

```text
index.html
```

Then click **Go to Home**.

You can also open the main page directly:

```text
pages/home.html
```

## Manual Test Flow

1. Open `index.html`.
2. Go to Home.
3. Click **Start Planning**.
4. Fill valid preferences and submit.
5. Confirm Recommendations opens and cards render.
6. Test filters and Clear Filters.
7. Click **View Details** on a trip card.
8. Confirm the correct trip details page loads.
9. Click **Save** as a guest and confirm the login/signup modal appears.
10. Create a demo account through `signup.html`.
11. Save a trip from Recommendations or Trip Details.
12. Open My Trips and confirm the saved trip appears.
13. Remove a saved trip.
14. Log out and confirm guest behavior returns.

## Course Requirements Covered

- Multiple linked HTML pages.
- Shared navigation and footer.
- External CSS file.
- External JavaScript files.
- Responsive design.
- CSS transitions and animations.
- Client-side form validation.
- Dynamic rendering from local data.
- At least two `addEventListener` interactions.
- Local browser storage for demo state.
- Local images only.

## Future Development

Possible later phases may add:

- Real backend authentication.
- Node.js and Express.js.
- MySQL database storage.
- Server-side recommendation logic.
- Real review submission.
- Real image credit/license completion.
- API or scraper-based destination enrichment.

These are not part of the current frontend-only phase.
