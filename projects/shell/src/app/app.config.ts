import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions, withComponentInputBinding } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';

/**
 * withViewTransitions() — API nativa del browser para animaciones entre rutas.
 * Sin ninguna librería extra, el browser aplica una transición fade al cambiar de página.
 * Se puede personalizar con CSS ::view-transition-* pseudoelementos.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withViewTransitions(),          // View Transitions API (nativa del browser)
      withComponentInputBinding(),    // Inputs de componente desde params de ruta
    ),
    provideAnimations(),
  ],
};
