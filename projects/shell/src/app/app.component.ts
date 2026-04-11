import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WebSocketService, GameStateService } from '@qa/shared';
import { environment } from '../environments/environment';

/**
 * AppComponent — Shell root component.
 *
 * Responsabilidades del Shell:
 * 1. Iniciar la conexión WebSocket (singleton, compartida con todos los MFEs)
 * 2. Despachar mensajes entrantes al GameStateService
 * 3. Proveer el <router-outlet> donde se renderizan los MFEs
 * 4. Mostrar indicador de estado de conexión
 *
 * Los MFEs sólo llaman a ws.send() — el Shell es el dueño de la conexión.
 */
@Component({
  selector: 'qa-shell-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <!-- Connection status pill — sólo visible si no está conectado -->
    @if (state.connectionStatus() !== 'connected') {
      <div class="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
        [class]="state.connectionStatus() === 'connecting'
          ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
          : 'bg-rose-500/20 border border-rose-500/40 text-rose-300'">
        <span class="w-2 h-2 rounded-full animate-pulse"
          [class]="state.connectionStatus() === 'connecting' ? 'bg-amber-400' : 'bg-rose-400'">
        </span>
        {{ state.connectionStatus() === 'connecting' ? 'Conectando...' : 'Sin conexión' }}
      </div>
    }

    <!-- Router outlet — aquí se renderizan los MFEs -->
    <router-outlet />
  `,
})
export class AppComponent implements OnInit {
  protected readonly state = inject(GameStateService);
  private readonly ws = inject(WebSocketService);

  ngOnInit(): void {
    // Conectar al WebSocket al arrancar el shell
    this.ws.connect(environment.wsUrl);

    // Despachar mensajes entrantes al GameStateService
    this.ws.messages.subscribe(msg => this.handleMessage(msg));
  }

  private handleMessage(msg: { type: string; payload: unknown }): void {
    const p = msg.payload as Record<string, unknown>;

    switch (msg.type) {
      case 'ROOM_CREATED':
      case 'ROOM_JOINED':
        this.state.setRoom(p['room'] as never);
        (p['players'] as never[])?.forEach(pl => this.state.addOrUpdatePlayer(pl));
        this.state.setIdentity(p['playerId'] as string, p['username'] as string);
        break;
      case 'PLAYER_JOINED':
        this.state.addOrUpdatePlayer(p['player'] as never);
        break;
      case 'PLAYER_LEFT':
        this.state.removePlayer(p['playerId'] as string);
        break;
      case 'ROUND_START':
        this.state.setRound(p as never);
        break;
      case 'ROUND_END':
        this.state.setRoundResult(p as never);
        break;
      case 'GAME_END':
        this.state.gameEnd.set(p as never);
        break;
      case 'LEADERBOARD':
        this.state.leaderboard.set(p['entries'] as never[]);
        break;
    }
  }
}
