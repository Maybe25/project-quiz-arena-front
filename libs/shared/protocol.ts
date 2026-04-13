/**
 * @qa/shared/protocol
 * Tipos TypeScript que modelan el protocolo WebSocket de QuizArena.
 * Compartido por todos los micro-frontends vía path alias en tsconfig.
 */

// ─── Acciones que el cliente ENVÍA al servidor ───────────────────────────────
export type Action =
  | 'CREATE_ROOM'
  | 'JOIN_ROOM'
  | 'LEAVE_ROOM'
  | 'START_GAME'
  | 'SUBMIT_ANSWER'
  | 'PLAYER_READY'
  | 'GET_LEADERBOARD';

// ─── Tipos de mensaje que el servidor ENVÍA al cliente ───────────────────────
export type MessageType =
  | 'ROOM_CREATED'
  | 'ROOM_JOINED'
  | 'PLAYER_JOINED'
  | 'PLAYER_LEFT'
  | 'GAME_STARTING'
  | 'ROUND_START'
  | 'ROUND_END'
  | 'GAME_END'
  | 'PLAYERS_READY'
  | 'LEADERBOARD'
  | 'ERROR';

// ─── Structs ──────────────────────────────────────────────────────────────────

export interface RoomInfo {
  roomId: string;
  roomCode: string;
  status: 'waiting' | 'playing' | 'finished';
  hostPlayerId: string;
}

export interface PlayerInfo {
  playerId: string;
  username: string;
  score: number;
  isReady: boolean;
}

export interface QuestionInfo {
  questionId: string;
  text: string;
  options: string[];   // 4 opciones, índice 0-3
}

export interface RoundStartPayload {
  roundNumber: number;
  totalRounds: number;
  roundId: string;
  question: QuestionInfo;
  timeLimitMs: number;
}

export interface RoundEndPayload {
  roundNumber: number;
  correctAnswer: number;   // índice 0-3 de la opción correcta
  scores: PlayerInfo[];    // ordenados desc por score
  playerPoints: number;    // puntos obtenidos este ronda por este jugador
}

export interface GameEndPayload {
  finalScores: PlayerInfo[];
  winnerId: string;
}

export interface LeaderboardEntry {
  playerId: string;
  username: string;
  totalScore: number;
  gamesPlayed: number;
  wins: number;
}

// ─── Mensajes entrantes (servidor → cliente) ──────────────────────────────────
export interface InboundMessage<T = unknown> {
  type: MessageType;
  payload: T;
}

// ─── Mensajes salientes (cliente → servidor) ──────────────────────────────────
export interface OutboundMessage {
  action: Action;
  payload?: Record<string, unknown>;
}
