export interface Player {
  id: string;
  name: string;
}

export interface Team {
  player1: Player;
  player2: Player;
  score: number;
}

export interface Match {
  id: string;
  courtNumber: number;
  courtName: string;
  teamA: Team;
  teamB: Team;
  isCompleted: boolean;
}

export interface Round {
  roundNumber: number; // 1-indexed
  matches: Match[];
  byePlayer?: Player | null; // Player sitting out if odd number of players
  isCompleted: boolean;
}

export interface TournamentConfig {
  totalPoints: number; // 16, 24, 32 (default 32)
  courtCount: number;  // 1 or 2
  tournamentName: string;
}

export interface PlayerStanding {
  player: Player;
  rank: number;
  pointsWon: number;
  pointsConceded: number;
  pointDifferential: number;
  matchesPlayed: number;
  matchesWon: number;
  matchesDrawn: number;
  matchesLost: number;
}

export interface PlayerMatchDetail {
  roundNumber: number;
  courtNumber: number;
  partner: Player;
  opponents: [Player, Player];
  teamScore: number;
  opponentScore: number;
  differential: number;
  result: 'W' | 'L' | 'D';
}

export interface Tournament {
  id: string;
  createdAt: string;
  updatedAt: string;
  config: TournamentConfig;
  players: Player[];
  rounds: Round[];
  currentRoundIndex: number; // 0-indexed
  isCompleted: boolean;
}

export interface SavedPlayer {
  id: string;
  name: string;
  timesPlayed: number;
  lastPlayed: string;
}
