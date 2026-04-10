import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

/**
 * Rutas del Shell — carga cada MFE bajo demanda usando loadRemoteModule().
 *
 * CLAVE: loadRemoteModule('mfeHome', './HomeRoutes') resuelve así:
 *   - 'mfeHome'       → entrada en federation.manifest.json → http://localhost:4201/remoteEntry.json
 *   - './HomeRoutes'  → nombre expuesto en el federation.config.js de mfe-home
 *
 * Esto permite que cada MFE se despliegue independientemente. El shell sólo
 * necesita conocer los remotes en tiempo de ejecución, no de compilación.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      loadRemoteModule('mfeHome', './HomeComponent')
        .then(m => m.HomeComponent)
        .catch(err => {
          console.error('[Shell] Error cargando mfe-home:', err);
          return import('./fallback.component').then(m => m.FallbackComponent);
        }),
  },
  {
    path: 'game',
    loadChildren: () =>
      loadRemoteModule('mfeGame', './GameRoutes')
        .then(m => m.GAME_ROUTES)
        .catch(err => {
          console.error('[Shell] Error cargando mfe-game:', err);
          return [];
        }),
  },
  {
    path: 'leaderboard',
    loadComponent: () =>
      loadRemoteModule('mfeLeaderboard', './LeaderboardComponent')
        .then(m => m.LeaderboardComponent)
        .catch(err => {
          console.error('[Shell] Error cargando mfe-leaderboard:', err);
          return import('./fallback.component').then(m => m.FallbackComponent);
        }),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
