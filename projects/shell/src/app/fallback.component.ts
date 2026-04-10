import { Component } from '@angular/core';

@Component({
  selector: 'qa-fallback',
  standalone: true,
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center"
      style="background:oklch(8% 0.02 285)">
      <div class="text-6xl mb-4">⬡</div>
      <h1 class="text-2xl font-bold text-white mb-2" style="font-family:'Space Grotesk'">
        QuizArena
      </h1>
      <p class="text-slate-400 mb-6" style="font-family:'Inter'">
        Cargando la aplicación...
      </p>
      <button class="px-6 py-2 rounded-xl text-sm text-slate-300 border border-white/10"
        style="font-family:'Inter'" (click)="reload()">
        Reintentar
      </button>
    </div>
  `,
})
export class FallbackComponent {
  reload(): void {
    window.location.reload();
  }
}
