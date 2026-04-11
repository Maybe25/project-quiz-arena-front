const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'mfeLeaderboard',

  exposes: {
    './LeaderboardComponent': './projects/mfe-leaderboard/src/app/leaderboard/leaderboard.component.ts',
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
