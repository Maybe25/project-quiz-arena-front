/**
 * Shell — Native Federation config (HOST / dynamic host)
 *
 * El shell carga los MFEs en RUNTIME usando el manifest (federation.manifest.json).
 * No conoce las URLs en tiempo de compilación → permite despliegue independiente.
 *
 * shareAll() comparte Angular, RxJS, y @qa/shared como singletons,
 * garantizando que TODOS los MFEs usen la misma instancia (1 zona, 1 router, 1 WS).
 */
const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'shell',

  // Los remotes se cargan dinámicamente desde federation.manifest.json en main.ts
  // No se declaran aquí → los MFEs pueden desplegarse sin recompilar el shell
  remotes: {},

  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: false,
      requiredVersion: 'auto',
      includeSecondaries: true,
    }),
  },

  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
  ],
});
