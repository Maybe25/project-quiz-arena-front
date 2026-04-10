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
    // Carga el componente Home desde mfe-home (puerto 4201)
    loadComponent: () =>
      loadRemoteModule('mfeHome', './HomeComponent').then(m => m.HomeComponent),
  },
  {
    path: 'game',
    // Carga las rutas hijas de mfe-game (lobby, play, result)
    loadChildren: () =>
      loadRemoteModule('mfeGame', './GameRoutes').then(m => m.GAME_ROUTES),
  },
  {
    path: 'leaderboard',
    // Carga el componente Leaderboard desde mfe-leaderboard (puerto 4203)
    loadComponent: () =>
      loadRemoteModule('mfeLeaderboard', './LeaderboardComponent').then(m => m.LeaderboardComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
