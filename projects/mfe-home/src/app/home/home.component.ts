import {
  Component, inject, signal, computed, ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WebSocketService, GameStateService } from '@qa/shared';

/**
 * HomeComponent — Pantalla principal.
 *
 * Flujo:
 *   1. El usuario escribe su apodo
 *   2. "Crear sala" → envía CREATE_ROOM → el Shell escucha ROOM_CREATED
 *      → actualiza GameStateService → navega a /game/lobby
 *   3. "Unirse" → envía JOIN_ROOM con roomCode → el Shell escucha ROOM_JOINED
 *      → navega a /game/lobby
 *
 * ChangeDetectionStrategy.OnPush: sólo re-renderiza cuando cambia un Signal
 * o un Input — compatible con Zoneless future.
 */
@Component({
  selector: 'qa-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, CommonModule],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private readonly ws     = inject(WebSocketService);
  private readonly state  = inject(GameStateService);
  private readonly router = inject(Router);

  // ─── Form state ───────────────────────────────────────────────────────────
  readonly username   = signal('');
  readonly roomCode   = signal('');
  readonly isLoading  = signal(false);
  readonly errorMsg   = signal('');

  readonly canCreate = computed(() => this.username().trim().length >= 2);
  readonly canJoin   = computed(() =>
    this.username().trim().length >= 2 && this.roomCode().trim().length === 6
  );

  // ─── Acciones ─────────────────────────────────────────────────────────────

  createRoom(): void {
    if (!this.canCreate()) return;
    this.isLoading.set(true);
    this.errorMsg.set('');
    this.ws.send('CREATE_ROOM', { username: this.username().trim() });
    this.listenForRoomEvent('ROOM_CREATED', '/game/lobby');
  }

  joinRoom(): void {
    if (!this.canJoin()) return;
    this.isLoading.set(true);
    this.errorMsg.set('');
    this.ws.send('JOIN_ROOM', {
      username: this.username().trim(),
      roomCode: this.roomCode().trim().toUpperCase(),
    });
    this.listenForRoomEvent('ROOM_JOINED', '/game/lobby');
  }

  goToLeaderboard(): void {
    this.router.navigate(['/leaderboard']);
  }

  onRoomCodeInput(value: string): void {
    this.roomCode.set(value.toUpperCase().slice(0, 6));
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private listenForRoomEvent(eventType: string, navigateTo: string): void {
    const sub = this.ws.messages.subscribe(msg => {
      if (msg.type === eventType) {
        sub.unsubscribe();
        this.isLoading.set(false);
        this.router.navigate([navigateTo]);
      } else if (msg.type === 'ERROR') {
        sub.unsubscribe();
        this.isLoading.set(false);
        this.errorMsg.set((msg.payload as { message: string }).message ?? 'Error desconocido');
      }
    });

    // Timeout de 10s por si el servidor no responde
    setTimeout(() => {
      sub.unsubscribe();
      if (this.isLoading()) {
        this.isLoading.set(false);
        this.errorMsg.set('Sin respuesta del servidor. Inténtalo de nuevo.');
      }
    }, 10_000);
  }
}
