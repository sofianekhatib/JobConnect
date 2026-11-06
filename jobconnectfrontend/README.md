# JobTrack — Frontend

JobTrack is a fake-data MVP for a job recruitment platform. It is built with React, Vite and Tailwind CSS.

## Run the project

```bash
cd jobconnectfrontend
npm install
npm run dev
```

Then open the URL printed by Vite (usually `http://localhost:5173`).

Other useful commands:

```bash
npm run build   # production build
npm run lint    # check the code style
npm run preview # preview the production build
```

## Fake data

All fake data lives in one file:

```
src/mockData.js
```

It contains `currentUser`, `jobs`, `applications`, `notifications`, `reports`, `users` and `cvs`.

Change `currentUser.role` in that file to `"CANDIDATE"`, `"RECRUITER"` or `"ADMIN"` to test each view.

## Main files

- `src/app/App.jsx` — routes
- `src/components/jobs/JobCard.jsx` — the one job card used on the Home and Saved pages
- `src/components/jobs/ApplyModal.jsx` — apply popup
- `src/components/jobs/ReportJobModal.jsx` — report popup
- `src/components/Shimmer.jsx` — shimmer placeholders
- `src/index.css` — the `.shimmer` animation

## Loading placeholders

Each list page shows gray shimmer placeholders for 1.5 seconds before the fake data appears. The timer is marked with this comment:

```js
// Later: replace this timer with the real API call; setIsLoading(false) when the data arrives.
```

When the real API is ready, delete the timer and call the API in its place.
