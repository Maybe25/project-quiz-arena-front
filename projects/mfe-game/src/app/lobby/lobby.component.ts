import {
  Component, inject, signal, computed,
  OnInit, OnDestroy, ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { WebSocketService, GameStateService } from '@qa/shared';

@Component({
  selector: 'qa-lobby',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './lobby.component.html',
})
export class LobbyComponent implements OnInit, OnDestroy {
  protected readonly state  = inject(GameStateService);
  private  readonly ws      = inject(WebSocketService);
  private  readonly router  = inject(Router);

  readonly copied = signal(false);
  private sub!: Subscription;

  readonly emptySlots = computed(() =>
    Math.max(0, 8 - this.state.players().length)
  );

  ngOnInit(): void {
    // Si no hay sala activa, redirigir al home
    if (!this.state.room()) {
      this.router.navigate(['/']);
      return;
    }
    // Escuchar GAME_STARTING para navegar a /game/play
    this.sub = this.ws.messages.subscribe(msg => {
      if (msg.type === 'GAME_STARTING') {
        this.router.navigate(['/game/play']);
      }
    });
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }

  startGame(): void {
    this.ws.send('START_GAME', { roomId: this.state.room()!.roomId });
  }

  leaveRoom(): void {
    this.ws.send('LEAVE_ROOM', { roomId: this.state.room()!.roomId });
    this.state.clearRoom();
    this.router.navigate(['/']);
  }

  copyCode(): void {
    const code = this.state.room()?.roomCode ?? '';
    navigator.clipboard.writeText(code).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
