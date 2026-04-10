import { initFederation } from '@angular-architects/native-federation';

initFederation()
  .catch(err => console.error('[mfe-game] Federation init error:', err))
  .then(() => import('./bootstrap'))
  .catch(err => console.error('[mfe-game] Bootstrap error:', err));
