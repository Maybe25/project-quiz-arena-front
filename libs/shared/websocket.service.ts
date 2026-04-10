import { Injectable, inject, OnDestroy } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { Subject, Observable, EMPTY, timer } from 'rxjs';
import { retryWhen, tap, delayWhen, catchError } from 'rxjs/operators';
import { GameStateService } from './game-state.service';
import type { InboundMessage, OutboundMessage, Action } from './protocol';

/**
 * WebSocketService — Gestión del WebSocket con reconexión automática.
 *
 * Usa RxJS WebSocketSubject para:
 *  - Mantener la conexión activa
 *  - Reconexión automática con backoff exponencial (1s → 2s → 4s → max 30s)
 *  - Un único stream de mensajes que los componentes pueden subscribirse
 *
 * MICRO-FRONTEND NOTE:
 * Este servicio también es singleton en native-federation. La conexión WS
 * se abre una sola vez aunque el usuario navegue entre MFEs.
 */
@Injectable({ providedIn: 'root' })
export class WebSocketService implements OnDestroy {

  private readonly state = inject(GameStateService);

  // URL del WebSocket — se configura antes de conectar
  private wsUrl = '';

  private ws$?: WebSocketSubject<InboundMessage>;
  private readonly messages$ = new Subject<InboundMessage>();
  private retryCount = 0;

  /** Stream de mensajes entrantes. Los componentes se suscriben a esto. */
  readonly messages: Observable<InboundMessage> = this.messages$.asObservable();

  /** Conectar al WebSocket de API Gateway. Llamar desde el shell al iniciar. */
  connect(url: string): void {
    if (this.ws$ && !this.ws$.closed) return;
    this.wsUrl = url;
    this.state.connectionStatus.set('connecting');

    this.ws$ = webSocket<InboundMessage>({
      url,
      openObserver: {
        next: () => {
          this.retryCount = 0;
          this.state.connectionStatus.set('connected');
          console.log('[WS] Conectado a', url);
        },
      },
      closeObserver: {
        next: () => {
          this.state.connectionStatus.set('disconnected');
          console.log('[WS] Desconectado');
        },
      },
    });

    this.ws$
      .pipe(
        // Reconexión con backoff exponencial
        retryWhen(errors =>
          errors.pipe(
            tap(() => {
              this.retryCount++;
              const delay = Math.min(1000 * 2 ** this.retryCount, 30_000);
              console.warn(`[WS] Reconectando en ${delay / 1000}s (intento ${this.retryCount})`);
              this.state.connectionStatus.set('connecting');
            }),
            delayWhen(() => timer(Math.min(1000 * 2 ** this.retryCount, 30_000))),
          ),
        ),
        catchError(err => {
          console.error('[WS] Error fatal:', err);
          return EMPTY;
        }),
      )
      .subscribe(msg => this.messages$.next(msg));
  }

  /** Enviar una acción al servidor. */
  send(action: Action, payload?: Record<string, unknown>): void {
    if (!this.ws$ || this.ws$.closed) {
      console.error('[WS] No conectado — no se puede enviar:', action);
      return;
    }
    const msg: OutboundMessage = { action, ...(payload ? { payload } : {}) };
    this.ws$.next(msg as unknown as InboundMessage);
  }

  disconnect(): void {
    this.ws$?.complete();
    this.ws$ = undefined;
  }

  ngOnDestroy(): void {
    this.disconnect();
    this.messages$.complete();
  }
}
