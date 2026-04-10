import {
  Component, inject, signal, computed, OnInit, ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WebSocketService, GameStateService } from '@qa/shared';
import type { LeaderboardEntry } from '@qa/shared';
import { Subscription } from 'rxjs';

@Component({
  selector: 'qa-leaderboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './leaderboard.component.html',
})
export class LeaderboardComponent implements OnInit {
  protected readonly state  = inject(GameStateService);
  private  readonly ws      = inject(WebSocketService);
  private  readonly router  = inject(Router);

  readonly isLoading = signal(false);
  private sub?: Subscription;

  readonly top3 = computed(() => this.state.leaderboard().slice(0, 3));
  readonly rest = computed(() => this.state.leaderboard().slice(3));

  readonly medals = ['🥇', '🥈', '🥉'];
  readonly podiumBg = [
    'from-amber-500/15 to-transparent border-amber-500/30',
    'from-slate-500/10 to-transparent border-slate-500/20',
    'from-orange-700/10 to-transparent border-orange-700/20',
  ];

  ngOnInit(): void {
    this.loadLeaderboard();
  }

  loadLeaderboard(): void {
    this.isLoading.set(true);
    this.ws.send('GET_LEADERBOARD');
    this.sub = this.ws.messages.subscribe(msg => {
      if (msg.type === 'LEADERBOARD') {
        this.isLoading.set(false);
        this.sub?.unsubscribe();
      }
    });
    setTimeout(() => {
      this.isLoading.set(false);
      this.sub?.unsubscribe();
    }, 8_000);
  }

  isMe(entry: LeaderboardEntry): boolean {
    return entry.playerId === this.state.myPlayerId();
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
