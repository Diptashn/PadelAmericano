import {
  Player,
  Match,
  Round,
  Tournament,
  TournamentConfig,
  PlayerStanding,
  PlayerMatchDetail,
} from '../types';
import {
  SCHEDULE_4_PLAYERS,
  SCHEDULE_5_PLAYERS,
  SCHEDULE_8_PLAYERS,
  generateGeneralSchedule,
  ScheduleRoundPattern,
} from '../constants/schedules';

export function buildTournament(
  playerNames: string[],
  config: TournamentConfig
): Tournament {
  const cleanNames = playerNames.map((n) => n.trim()).filter((n) => n.length > 0);
  const players: Player[] = cleanNames.map((name, idx) => ({
    id: `player-${idx + 1}-${Date.now().toString(36)}`,
    name,
  }));

  const count = players.length;
  let schedulePatterns: ScheduleRoundPattern[];

  if (count === 4) {
    schedulePatterns = SCHEDULE_4_PLAYERS;
  } else if (count === 5) {
    schedulePatterns = SCHEDULE_5_PLAYERS;
  } else if (count === 8) {
    schedulePatterns = SCHEDULE_8_PLAYERS;
  } else {
    schedulePatterns = generateGeneralSchedule(count, config.courtCount);
  }

  const initialScore = Math.floor(config.totalPoints / 2);
  const complementaryScore = config.totalPoints - initialScore;

  const rounds: Round[] = schedulePatterns.map((roundPattern, roundIdx) => {
    const matches: Match[] = roundPattern.matches.map((m, matchIdx) => {
      const courtNumber = matchIdx + 1;
      return {
        id: `r${roundIdx + 1}-m${courtNumber}`,
        courtNumber,
        courtName: `Court ${courtNumber}`,
        teamA: {
          player1: players[m.t1[0]],
          player2: players[m.t1[1]],
          score: initialScore,
        },
        teamB: {
          player1: players[m.t2[0]],
          player2: players[m.t2[1]],
          score: complementaryScore,
        },
        isCompleted: false,
      };
    });

    const byePlayer =
      roundPattern.bye !== undefined ? players[roundPattern.bye] : null;

    return {
      roundNumber: roundIdx + 1,
      matches,
      byePlayer,
      isCompleted: false,
    };
  });

  return {
    id: `tournament-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    config,
    players,
    rounds,
    currentRoundIndex: 0,
    isCompleted: false,
  };
}

export function calculateStandings(tournament: Tournament): PlayerStanding[] {
  const statsMap = new Map<
    string,
    {
      player: Player;
      pointsWon: number;
      pointsConceded: number;
      matchesPlayed: number;
      matchesWon: number;
      matchesDrawn: number;
      matchesLost: number;
    }
  >();

  tournament.players.forEach((p) => {
    statsMap.set(p.id, {
      player: p,
      pointsWon: 0,
      pointsConceded: 0,
      matchesPlayed: 0,
      matchesWon: 0,
      matchesDrawn: 0,
      matchesLost: 0,
    });
  });

  // Calculate points from completed rounds
  tournament.rounds.forEach((round) => {
    if (!round.isCompleted) return;

    round.matches.forEach((match) => {
      const scoreA = match.teamA.score;
      const scoreB = match.teamB.score;

      const teamAPlayers = [match.teamA.player1, match.teamA.player2];
      const teamBPlayers = [match.teamB.player1, match.teamB.player2];

      teamAPlayers.forEach((p) => {
        const stats = statsMap.get(p.id);
        if (stats) {
          stats.pointsWon += scoreA;
          stats.pointsConceded += scoreB;
          stats.matchesPlayed += 1;
          if (scoreA > scoreB) stats.matchesWon += 1;
          else if (scoreA === scoreB) stats.matchesDrawn += 1;
          else stats.matchesLost += 1;
        }
      });

      teamBPlayers.forEach((p) => {
        const stats = statsMap.get(p.id);
        if (stats) {
          stats.pointsWon += scoreB;
          stats.pointsConceded += scoreA;
          stats.matchesPlayed += 1;
          if (scoreB > scoreA) stats.matchesWon += 1;
          else if (scoreB === scoreA) stats.matchesDrawn += 1;
          else stats.matchesLost += 1;
        }
      });
    });
  });

  const rawList: PlayerStanding[] = Array.from(statsMap.values()).map((s) => ({
    player: s.player,
    rank: 0,
    pointsWon: s.pointsWon,
    pointsConceded: s.pointsConceded,
    pointDifferential: s.pointsWon - s.pointsConceded,
    matchesPlayed: s.matchesPlayed,
    matchesWon: s.matchesWon,
    matchesDrawn: s.matchesDrawn,
    matchesLost: s.matchesLost,
  }));

  // Sort by Americano criteria:
  // 1. Total cumulative points won (Primary)
  // 2. Point differential (Secondary)
  // 3. Matches won (Tertiary)
  rawList.sort((a, b) => {
    if (b.pointsWon !== a.pointsWon) {
      return b.pointsWon - a.pointsWon;
    }
    if (b.pointDifferential !== a.pointDifferential) {
      return b.pointDifferential - a.pointDifferential;
    }
    if (b.matchesWon !== a.matchesWon) {
      return b.matchesWon - a.matchesWon;
    }
    return a.player.name.localeCompare(b.player.name);
  });

  // Assign ranks
  return rawList.map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));
}

export function getPlayerMatchHistory(
  tournament: Tournament,
  playerId: string
): PlayerMatchDetail[] {
  const history: PlayerMatchDetail[] = [];

  tournament.rounds.forEach((round) => {
    round.matches.forEach((match) => {
      const inTeamA =
        match.teamA.player1.id === playerId || match.teamA.player2.id === playerId;
      const inTeamB =
        match.teamB.player1.id === playerId || match.teamB.player2.id === playerId;

      if (!inTeamA && !inTeamB) return;

      const isTeamA = inTeamA;
      const myTeam = isTeamA ? match.teamA : match.teamB;
      const oppTeam = isTeamA ? match.teamB : match.teamA;

      const partner =
        myTeam.player1.id === playerId ? myTeam.player2 : myTeam.player1;
      const opponents: [Player, Player] = [oppTeam.player1, oppTeam.player2];

      const teamScore = myTeam.score;
      const opponentScore = oppTeam.score;
      const differential = teamScore - opponentScore;

      let result: 'W' | 'L' | 'D' = 'D';
      if (teamScore > opponentScore) result = 'W';
      else if (teamScore < opponentScore) result = 'L';

      history.push({
        roundNumber: round.roundNumber,
        courtNumber: match.courtNumber,
        partner,
        opponents,
        teamScore,
        opponentScore,
        differential,
        result,
      });
    });
  });

  return history;
}
