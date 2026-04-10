import { Routes } from '@angular/router';

/**
 * GAME_ROUTES — Rutas expuestas como remote por mfe-game.
 * El shell las carga bajo el prefijo /game.
 *
 * /game/lobby  → LobbyComponent (sala de espera)
 * /game/play   → GameComponent  (pregunta activa + timer)
 * /game/result → ResultComponent (podio final)
 */
export const GAME_ROUTES: Routes = [
  {
    path: 'lobby',
    loadComponent: () => import('./lobby/lobby.component').then(m => m.LobbyComponent),
  },
  {
    path: 'play',
    loadComponent: () => import('./game/game.component').then(m => m.GameComponent),
  },
  {
    path: 'result',
    loadComponent: () => import('./result/result.component').then(m => m.ResultComponent),
  },
  {
    path: '',
    redirectTo: 'lobby',
    pathMatch: 'full',
  },
];
