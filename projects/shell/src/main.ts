import { initFederation } from '@angular-architects/native-federation';
import { environment } from './environments/environment';

/**
 * main.ts — Shell entry point.
 *
 * initFederation() carga el manifest correcto según el entorno:
 *  - development → /federation.manifest.json      (localhost:4201/4202/4203)
 *  - production  → /federation.manifest.prod.json  (CloudFront distributions)
 *
 * IMPORTANTE: La importación dinámica de './bootstrap' es OBLIGATORIA.
 * Native Federation necesita registrar todos los módulos remotos ANTES de
 * que Angular arranque. Sin el split en dos archivos (main.ts + bootstrap.ts),
 * las importaciones eager de Angular romperían la federación.
 */
initFederation(environment.federationManifest)
  .catch(err => console.error('[Shell] Error cargando federation manifest:', err))
  .then(() => import('./bootstrap'))
  .catch(err => console.error('[Shell] Bootstrap error:', err));
