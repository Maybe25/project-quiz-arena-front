import {
  Component, inject, computed, ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GameStateService } from '@qa/shared';

@Component({
  selector: 'qa-result',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './result.component.html',
})
export class ResultComponent {
  protected readonly state  = inject(GameStateService);
  private  readonly router  = inject(Router);

  // Top 3 del podio ordenados por score
  readonly top3 = computed(() =>
    (this.state.gameEnd()?.finalScores ?? this.state.sortedPlayers()).slice(0, 3)
  );

  // El resto de jugadores (4+)
  readonly rest = computed(() =>
    (this.state.gameEnd()?.finalScores ?? this.state.sortedPlayers()).slice(3)
  );

  readonly podiumOrder = [1, 0, 2]; // 2do, 1ro, 3ro (visual)

  readonly medals = ['🥇', '🥈', '🥉'];
  readonly podiumHeights = [110, 155, 80]; // px del pedestal en orden visual

  playAgain(): void {
    this.state.clearRoom();
    this.router.navigate(['/']);
  }

  goHome(): void {
    this.state.clearRoom();
    this.router.navigate(['/']);
  }
}
