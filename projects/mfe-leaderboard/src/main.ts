import { initFederation } from '@angular-architects/native-federation';

initFederation()
  .catch(err => console.error('[mfe-leaderboard] Federation init error:', err))
  .then(() => import('./bootstrap'))
  .catch(err => console.error('[mfe-leaderboard] Bootstrap error:', err));
