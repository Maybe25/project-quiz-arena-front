import { Injectable, signal, computed } from '@angular/core';
import type {
  RoomInfo, PlayerInfo, RoundStartPayload,
  RoundEndPayload, GameEndPayload, LeaderboardEntry,
} from './protocol';

/**
 * GameStateService — Estado global del juego con Angular Signals.
 *
 * PATRÓN MICRO-FRONTEND:
 * Este servicio vive en la librería compartida y es declarado como singleton
 * en la federation config (shareAll). Native Federation garantiza que todos
 * los MFEs que importen este módulo compartan la MISMA instancia en runtime.
 *
 * El estado también se persiste en sessionStorage para sobrevivir navegaciones
 * entre MFEs (cada MFE es una app Angular separada con su propio bootstrap).
 */
@Injectable({ providedIn: 'root' })
export class GameStateService {

  // ─── Identidad del jugador local ──────────────────────────────────────────
  readonly myPlayerId = signal<string>(
    sessionStorage.getItem('qa:playerId') ?? ''
  );
  readonly myUsername = signal<string>(
    sessionStorage.getItem('qa:username') ?? ''
  );

  // ─── Estado de sala y jugadores ───────────────────────────────────────────
  readonly room    = signal<RoomInfo | null>(null);
  readonly players = signal<PlayerInfo[]>([]);

  // ─── Estado de partida ────────────────────────────────────────────────────
  readonly currentRound  = signal<RoundStartPayload | null>(null);
  readonly roundResult   = signal<RoundEndPayload | null>(null);
  readonly gameEnd       = signal<GameEndPayload | null>(null);
  readonly selectedAnswer = signal<number | null>(null);  // índice 0-3

  // ─── Leaderboard global ───────────────────────────────────────────────────
  readonly leaderboard = signal<LeaderboardEntry[]>([]);

  // ─── Estado de conexión ───────────────────────────────────────────────────
  readonly connectionStatus = signal<'disconnected' | 'connecting' | 'connected'>('disconnected');

  // ─── Computed values ─────────────────────────────────────────────────────
  readonly isHost = computed(() =>
    !!this.room() && this.room()!.hostPlayerId === this.myPlayerId()
  );
  readonly myScore = computed(() =>
    this.players().find(p => p.playerId === this.myPlayerId())?.score ?? 0
  );
  readonly sortedPlayers = computed(() =>
    [...this.players()].sort((a, b) => b.score - a.score)
  );
  readonly roundProgress = computed(() => {
    const r = this.currentRound();
    return r ? { current: r.roundNumber, total: r.totalRounds } : null;
  });

  // ─── Mutadores ────────────────────────────────────────────────────────────

  setIdentity(playerId: string, username: string): void {
    this.myPlayerId.set(playerId);
    this.myUsername.set(username);
    sessionStorage.setItem('qa:playerId', playerId);
    sessionStorage.setItem('qa:username', username);
  }

  setRoom(room: RoomInfo): void {
    this.room.set(room);
    sessionStorage.setItem('qa:roomCode', room.roomCode);
  }

  clearRoom(): void {
    this.room.set(null);
    this.players.set([]);
    this.currentRound.set(null);
    this.roundResult.set(null);
    this.gameEnd.set(null);
    this.selectedAnswer.set(null);
    sessionStorage.removeItem('qa:roomCode');
  }

  addOrUpdatePlayer(player: PlayerInfo): void {
    this.players.update(list => {
      const idx = list.findIndex(p => p.playerId === player.playerId);
      if (idx >= 0) {
        const copy = [...list];
        copy[idx] = player;
        return copy;
      }
      return [...list, player];
    });
  }

  removePlayer(playerId: string): void {
    this.players.update(list => list.filter(p => p.playerId !== playerId));
  }

  setRound(payload: RoundStartPayload): void {
    this.currentRound.set(payload);
    this.roundResult.set(null);
    this.selectedAnswer.set(null);
  }

  setRoundResult(payload: RoundEndPayload): void {
    this.roundResult.set(payload);
    // Actualizar scores de todos los jugadores
    payload.scores.forEach(p => this.addOrUpdatePlayer(p));
  }
}
