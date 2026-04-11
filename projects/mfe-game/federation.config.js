const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'mfeGame',

  exposes: {
    // Array de rutas hijas: /game/lobby, /game/play, /game/result
    './GameRoutes': './projects/mfe-game/src/app/game.routes.ts',
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
