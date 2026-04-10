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
      } else if (msg.type === 'GAME_END') {
        this.router.navigate(['/game/result']);
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
