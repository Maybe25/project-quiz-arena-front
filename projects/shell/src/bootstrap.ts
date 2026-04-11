import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// Unregister any stale service workers so users always get the latest build
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(r => r.unregister());
  });
}

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error('[Shell] Bootstrap error:', err));
