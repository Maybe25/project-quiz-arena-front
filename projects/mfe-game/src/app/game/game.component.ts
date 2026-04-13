import {
  Component, inject, signal, computed,
  OnInit, OnDestroy, ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { WebSocketService, GameStateService } from '@qa/shared';
import { TimerBarComponent } from './timer-bar.component';
import { RoundResultComponent } from './round-result.component';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;
const OPTION_CLASSES = ['opt-a', 'opt-b', 'opt-c', 'opt-d'] as const;

@Component({
  selector: 'qa-game',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TimerBarComponent, RoundResultComponent],
  templateUrl: './game.component.html',
})
export class GameComponent implements OnInit, OnDestroy {
  protected readonly state = inject(GameStateService);
  private  readonly ws     = inject(WebSocketService);
  private  readonly router = inject(Router);

  readonly letters = OPTION_LETTERS;
  readonly optClasses = OPTION_CLASSES;

  range(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }

  readonly showResult = signal(false);
  readonly isReady    = signal(false);
  readonly readyCount = signal(0);
  readonly totalCount = signal(0);
  private sub!: Subscription;

  ngOnInit(): void {
    if (!this.state.room() || !this.state.currentRound()) {
      this.router.navigate(['/game/lobby']);
      return;
    }
    this.sub = this.ws.messages.subscribe(msg => {
      if (msg.type === 'ROUND_END') {
        this.showResult.set(true);
      } else if (msg.type === 'ROUND_START') {
        this.showResult.set(false);
        this.isReady.set(false);
        this.readyCount.set(0);
        this.totalCount.set(0);
      } else if (msg.type === 'GAME_END') {
        this.router.navigate(['/game/result']);
      } else if (msg.type === 'PLAYERS_READY') {
        const p = (msg as any).payload;
        this.readyCount.set(p.readyCount ?? 0);
        this.totalCount.set(p.totalCount ?? 0);
      }
    });
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }

  selectAnswer(index: number): void {
    if (this.state.selectedAnswer() !== null) return;
    this.state.selectedAnswer.set(index);
    this.ws.send('SUBMIT_ANSWER', {
      roomId:   this.state.room()!.roomId,
      roundId:  this.state.currentRound()!.roundId,
      answer:   index,
    });
  }

  markReady(): void {
    if (this.isReady()) return;
    this.isReady.set(true);
    this.ws.send('PLAYER_READY', {
      roomId:      this.state.room()!.roomId,
      roundNumber: this.state.currentRound()!.roundNumber,
    });
  }

  optionState(index: number): string {
    const selected = this.state.selectedAnswer();
    const result   = this.state.roundResult();
    if (result) {
      if (index === result.correctAnswer)        return 'correct';
      if (index === selected)                    return 'wrong';
      return 'expired';
    }
    if (selected === null) return '';
    return selected === index ? 'selected' : '';
  }
}
