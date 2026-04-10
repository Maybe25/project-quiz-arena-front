# QuizArena Frontend — Micro-Frontend con Angular 19 + Native Federation

## Arquitectura

```
Shell (puerto 4200)  ← Host de micro-frontends
├── mfe-home         (puerto 4201)  Home screen
├── mfe-game         (puerto 4202)  Lobby + Juego + Podio
└── mfe-leaderboard  (puerto 4203)  Leaderboard global

libs/shared/         Librería compartida (singleton via Native Federation)
  ├── protocol.ts          Interfaces TypeScript del protocolo WS
  ├── game-state.service.ts  Signals globales (estado del juego)
  └── websocket.service.ts   Conexión WS + reconexión automática
```

## Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| Angular | 19 | Framework base, Signals, standalone |
| @angular-architects/native-federation | 19 | Micro-frontends con ES Modules |
| TailwindCSS | 3.x | Utility-first con tokens oklch |
| TypeScript | 5.6 | Tipado del protocolo WS |
| View Transitions API | browser nativa | Animaciones entre rutas |

## Setup inicial

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar la URL del WebSocket
# Editar: projects/shell/src/environments/environment.ts
# Cambiar <API_ID> por el ID real de tu API Gateway WebSocket

# 3. Arrancar todos los MFEs en paralelo
npm run start:all
```

## Desarrollo individual

```bash
# Sólo el shell (necesita los MFEs corriendo)
npm run start:shell

# Sólo mfe-home standalone
npm run start:mfe-home

# Sólo mfe-game
npm run start:mfe-game

# Sólo mfe-leaderboard
npm run start:mfe-leaderboard
```

## Obtener la URL del WebSocket

```bash
cd ../project-websocket/infrastructure/terraform
terraform output ws_url
```

## Cómo funciona Native Federation

1. `main.ts` llama `initFederation('/federation.manifest.json')`
2. El manifest apunta a los `remoteEntry.json` de cada MFE
3. Angular carga los módulos remotos bajo demanda al navegar
4. `shareAll()` garantiza una sola instancia de Angular, RxJS, y `@qa/shared`
5. `GameStateService` y `WebSocketService` son **verdaderos singletons** entre todos los MFEs

## Flujo de juego

```
/ (Home)           → CREATE_ROOM / JOIN_ROOM
/game/lobby        ← ROOM_CREATED / ROOM_JOINED / PLAYER_JOINED
                   → START_GAME (host)
/game/play         ← GAME_STARTING / ROUND_START
                   → SUBMIT_ANSWER
                   ← ROUND_END  (overlay resultado)
                   ← ROUND_START (siguiente pregunta)
                   ← GAME_END
/game/result       Podio final
/leaderboard       ← LEADERBOARD (GET_LEADERBOARD)
```
