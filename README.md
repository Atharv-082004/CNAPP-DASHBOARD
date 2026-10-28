https://cnapp-dashboard-omega.vercel.app/

# CNAPP Dashboard

A responsive React dashboard assignment demo matching the provided dashboard-only screenshots, without the application sidebar or top navigation bar. Dashboard sections and their widgets are defined as JSON-shaped data in `src/main.jsx`. The UI includes widget search (use the magnifying-glass button), a date range selector, removable widgets, and an Add widgets panel for restoring existing widgets or creating a widget with a custom name and text. Changes persist in the browser's local storage.

## Run locally

1. Install Node.js 18 or newer.
2. In this project folder, install dependencies:

   ```sh
   npm install
   ```

3. Start the development server:

   ```sh
   npm run dev
   ```

4. Open the local URL printed by Vite (usually `http://localhost:5173`).

To create and preview a production build, run `npm run build` followed by `npm run preview`.

## Data and state

The dashboard model is the `initialDashboard` object in `src/main.jsx`; each category has an `id`, `name`, and `widgets` array. A reducer provides local add, remove, and toggle actions, and the current dashboard state is saved under `cnapp-dashboard-state` in local storage.

## Share

The project is ready to push to a GitHub repository or package as a ZIP. No remote repository is configured in this workspace.
