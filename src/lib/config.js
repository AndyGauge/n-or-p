// Book-wide metadata + service ids.
// Edit these freely; nothing else reads them outside of routes/.

export const TITLE = 'N or P';
export const AUTHOR = 'Andrew Gauger';
export const YEAR = 2026;

// Canonical site URL — used by per-page <PageMeta> to build og:url so
// link unfurlers (Slack, iMessage, Discord) point at the deployed page.
// Leave blank to disable canonical tags. No trailing slash.
export const SITE_URL = 'https://andygauge.github.io/norp';

// Giscus (GitHub Discussions comments). Open https://giscus.app, select your
// repo, copy the four ids here. If any is blank, the comment widget simply
// doesn't render — safe default.
export const GISCUS = {
  repo: 'andygauge/norp',
  repoId: '',
  category: 'General',
  categoryId: ''
};
