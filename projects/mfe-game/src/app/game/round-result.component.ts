import {
  Component, Input, signal, computed, OnInit, ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import type { RoundEndPayload } from '@qa/shared';

/**
 * RoundResultComponent — Overlay de resultado al final de cada ronda.
 * Se renderiza como bottom-sheet animado sobre el juego.
 */
@Component({
  selector: 'qa-round-result',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <!-- Backdrop oscurecido -->
    <div class="absolute inset-0 z-20" style="background:rgba(0,0,0,0.45);backdrop-filter:blur(2px)"></div>

    <!-- Bottom sheet -->
    <div class="absolute bottom-0 left-0 right-0 z-30 animate-slide-up"
      style="background:rgba(9,9,15,0.97);border-top:1px solid rgba(124,58,237,0.3);border-radius:24px 24px 0 0;padding:32px 24px 32px;max-height:70vh;overflow-y:auto">

      <!-- Resultado personal -->
      <div class="text-center mb-6">
        @if (isCorrect()) {
          <div class="text-5xl mb-3">✅</div>
          <h2 class="text-3xl font-bold text-emerald-400" style="font-family:'Space Grotesk'">¡Respuesta Correcta!</h2>
        } @else {
          <div class="text-5xl mb-3">❌</div>
          <h2 class="text-3xl font-bold text-rose-400" style="font-family:'Space Grotesk'">Respuesta Incorrecta</h2>
          <p class="text-slate-400 text-sm mt-2" style="font-family:'Inter'">
            La correcta era:
            <span class="text-emerald-400 font-semibold">{{ correctOptionText() }}</span>
          </p>
        }
        <div class="text-5xl font-bold text-amber-400 mt-4" style="font-family:'JetBrains Mono'">
          +{{ result.playerPoints.toLocaleString() }} pts
        </div>
      </div>

      <div class="h-px mb-5" style="background:rgba(255,255,255,0.07)"></div>

      <!-- Tabla de scores -->
      <h3 class="text-xs text-slate-400 uppercase tracking-widest text-center mb-4" style="font-family:'Inter'">
        Puntuaciones
      </h3>
      <div class="space-y-3 max-w-sm mx-auto">
        @for (player of result.scores.slice(0, 5); track player.playerId; let i = $index) {
          <div>
            <div class="flex items-center justify-between mb-1">
              <div class="flex items-center gap-2">
                <span>{{ medals[i] ?? '·' }}</span>
                <span class="text-sm text-slate-200" style="font-family:'Inter'">{{ player.username }}</span>
              </div>
              <span class="text-sm font-semibold text-amber-400" style="font-family:'JetBrains Mono'">
                {{ player.score.toLocaleString() }}
              </span>
            </div>
            <!-- Score bar -->
            <div class="h-1.5 rounded-full" style="background:rgba(255,255,255,0.07)">
              <div class="h-full rounded-full transition-all duration-700"
                [style.width]="scoreBarPct(player.score) + '%'"
                [style]="i === 0
                  ? 'background:linear-gradient(90deg,#7c3aed,#06b6d4)'
                  : 'background:rgba(255,255,255,0.18)'">
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class RoundResultComponent implements OnInit {
  @Input({ required: true }) result!: RoundEndPayload;
  @Input() myAnswer: number | null = null;

  readonly medals: (string | undefined)[] = ['🥇', '🥈', '🥉', '4.', '5.'];

  readonly isCorrect = computed(() =>
    this.myAnswer !== null && this.myAnswer === this.result.correctAnswer
  );

  readonly correctOptionText = computed(() =>
    // La opción correcta (letra) para mostrar cuando falla
    ['A', 'B', 'C', 'D'][this.result.correctAnswer] ?? '?'
  );

  ngOnInit(): void {}

  scoreBarPct(score: number): number {
    const max = this.result.scores[0]?.score ?? 1;
    return max > 0 ? (score / max) * 100 : 0;
  }
}
