/**
 * mfe-home — Native Federation config (REMOTE)
 *
 * Expone dos puntos de entrada al shell:
 *   - './HomeComponent'  → componente raíz del MFE (Home screen)
 *
 * shareAll() sincroniza las versiones con el shell para evitar
 * duplicar Angular, RxJS, etc. en el bundle descargado.
 */
const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'mfeHome',

  exposes: {
    './HomeComponent': './projects/mfe-home/src/app/home/home.component.ts',
  },

  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: false,
      requiredVersion: 'auto',
      includeSecondaries: true,
    }),
  },

  skip: ['rxjs/ajax', 'rxjs/fetch', 'rxjs/testing'],
});
