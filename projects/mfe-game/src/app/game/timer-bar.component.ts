import {
  Component, Input, OnChanges, OnDestroy,
  signal, computed, ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * TimerBarComponent — Barra de tiempo decreciente.
 *
 * Recibe el tiempo límite en ms y hace el countdown localmente.
 * Emite (timeout) cuando llega a 0.
 * Cambia a rojo con pulso cuando queda < 20% del tiempo.
 */
@Component({
  selector: 'qa-timer-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-3">
      <!-- Segundos -->
      <span class="font-mono font-bold text-xl w-10 text-right flex-shrink-0"
        [class]="isDanger() ? 'text-rose-400' : 'text-cyan-400'"
        style="font-family:'JetBrains Mono'">
        {{ secondsLeft() }}s
      </span>
      <!-- Track -->
      <div class="timer-track flex-1" style="height:8px">
        <div class="timer-fill"
          [class.danger]="isDanger()"
          [style.width]="widthPct() + '%'">
        </div>
      </div>
    </div>
  `,
})
export class TimerBarComponent implements OnChanges, OnDestroy {
  @Input() timeLimitMs = 30_000;

  private intervalId?: ReturnType<typeof setInterval>;
  private startTs = 0;

  readonly msLeft    = signal(30_000);
  readonly secondsLeft = computed(() => Math.ceil(this.msLeft() / 1000));
  readonly widthPct    = computed(() => Math.max(0, (this.msLeft() / this.timeLimitMs) * 100));
  readonly isDanger    = computed(() => this.widthPct() < 20);

  ngOnChanges(): void {
    this.stop();
    this.msLeft.set(this.timeLimitMs);
    this.startTs = Date.now();
    this.intervalId = setInterval(() => {
      const elapsed = Date.now() - this.startTs;
      const remaining = Math.max(0, this.timeLimitMs - elapsed);
      this.msLeft.set(remaining);
      if (remaining <= 0) this.stop();
    }, 250);
  }

  ngOnDestroy(): void { this.stop(); }

  private stop(): void {
    clearInterval(this.intervalId);
    this.intervalId = undefined;
  }
}
