import { initFederation } from '@angular-architects/native-federation';

// El MFE también arranca con initFederation aunque no cargue remotes,
// para que Native Federation registre correctamente sus propios exports.
initFederation()
  .catch(err => console.error('[mfe-home] Federation init error:', err))
  .then(() => import('./bootstrap'))
  .catch(err => console.error('[mfe-home] Bootstrap error:', err));
