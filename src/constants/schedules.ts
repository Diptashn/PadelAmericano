export interface ScheduleMatchPattern {
  t1: [number, number];
  t2: [number, number];
}

export interface ScheduleRoundPattern {
  matches: ScheduleMatchPattern[];
  bye?: number;
}

// 4 Players: 1 Court, 3 Rounds. Everyone plays with each partner once.
export const SCHEDULE_4_PLAYERS: ScheduleRoundPattern[] = [
  {
    matches: [{ t1: [0, 1], t2: [2, 3] }],
  },
  {
    matches: [{ t1: [0, 2], t2: [1, 3] }],
  },
  {
    matches: [{ t1: [0, 3], t2: [1, 2] }],
  },
];

// 5 Players: 1 Court, 5 Rounds. 1 Bye per round. Every pair partners exactly once.
export const SCHEDULE_5_PLAYERS: ScheduleRoundPattern[] = [
  {
    bye: 0,
    matches: [{ t1: [1, 2], t2: [3, 4] }],
  },
  {
    bye: 1,
    matches: [{ t1: [0, 3], t2: [2, 4] }],
  },
  {
    bye: 2,
    matches: [{ t1: [0, 4], t2: [1, 3] }],
  },
  {
    bye: 3,
    matches: [{ t1: [0, 2], t2: [1, 4] }],
  },
  {
    bye: 4,
    matches: [{ t1: [0, 1], t2: [2, 3] }],
  },
];

// 8 Players: 2 Courts, 7 Rounds. Whist Tournament structure.
// Every player partners with every other player exactly once (28 pairs).
// Every player plays against every opponent twice.
export const SCHEDULE_8_PLAYERS: ScheduleRoundPattern[] = [
  {
    matches: [
      { t1: [0, 1], t2: [2, 3] },
      { t1: [4, 5], t2: [6, 7] },
    ],
  },
  {
    matches: [
      { t1: [0, 2], t2: [4, 6] },
      { t1: [1, 3], t2: [5, 7] },
    ],
  },
  {
    matches: [
      { t1: [0, 3], t2: [4, 7] },
      { t1: [1, 2], t2: [5, 6] },
    ],
  },
  {
    matches: [
      { t1: [0, 4], t2: [1, 5] },
      { t1: [2, 6], t2: [3, 7] },
    ],
  },
  {
    matches: [
      { t1: [0, 5], t2: [2, 7] },
      { t1: [1, 4], t2: [3, 6] },
    ],
  },
  {
    matches: [
      { t1: [0, 6], t2: [3, 5] },
      { t1: [1, 7], t2: [2, 4] },
    ],
  },
  {
    matches: [
      { t1: [0, 7], t2: [1, 6] },
      { t1: [2, 5], t2: [3, 4] },
    ],
  },
];

/**
 * Fallback generator for custom player counts (e.g. 6, 7, 10, 12 players)
 */
export function generateGeneralSchedule(playerCount: number, courtCount: number): ScheduleRoundPattern[] {
  if (playerCount === 4) return SCHEDULE_4_PLAYERS;
  if (playerCount === 5) return SCHEDULE_5_PLAYERS;
  if (playerCount === 8) return SCHEDULE_8_PLAYERS;

  const roundsCount = playerCount % 2 === 1 ? playerCount : playerCount - 1;
  const playersPerCourt = 4;
  const maxActivePlayers = Math.min(playerCount, courtCount * playersPerCourt);
  const actualCourts = Math.floor(maxActivePlayers / playersPerCourt);

  const partnerCounts = Array.from({ length: playerCount }, () => Array(playerCount).fill(0));
  const oppCounts = Array.from({ length: playerCount }, () => Array(playerCount).fill(0));
  const gamesPlayed = Array(playerCount).fill(0);

  const rounds: ScheduleRoundPattern[] = [];

  for (let r = 0; r < roundsCount; r++) {
    // Select players with fewest games played
    const sortedPlayerIndices = Array.from({ length: playerCount }, (_, i) => i)
      .sort((a, b) => gamesPlayed[a] - gamesPlayed[b]);

    const activePlayers = sortedPlayerIndices.slice(0, actualCourts * playersPerCourt);
    const byes = sortedPlayerIndices.slice(actualCourts * playersPerCourt);

    // Form pairs minimizing previous partnerships
    const roundMatches: ScheduleMatchPattern[] = [];
    const remaining = [...activePlayers];

    while (remaining.length >= 4) {
      // Pick p1
      const p1 = remaining.shift()!;
      // Find best partner with lowest partnerCount
      let bestPartnerIdx = 0;
      let minPartnerCount = Infinity;
      for (let i = 0; i < remaining.length; i++) {
        const candidate = remaining[i];
        if (partnerCounts[p1][candidate] < minPartnerCount) {
          minPartnerCount = partnerCounts[p1][candidate];
          bestPartnerIdx = i;
        }
      }
      const p2 = remaining.splice(bestPartnerIdx, 1)[0];

      // Next pick p3
      const p3 = remaining.shift()!;
      // Find best partner for p3
      let bestPartner2Idx = 0;
      let minPartner2Count = Infinity;
      for (let i = 0; i < remaining.length; i++) {
        const candidate = remaining[i];
        if (partnerCounts[p3][candidate] < minPartner2Count) {
          minPartner2Count = partnerCounts[p3][candidate];
          bestPartner2Idx = i;
        }
      }
      const p4 = remaining.splice(bestPartner2Idx, 1)[0];

      roundMatches.push({ t1: [p1, p2], t2: [p3, p4] });

      partnerCounts[p1][p2]++;
      partnerCounts[p2][p1]++;
      partnerCounts[p3][p4]++;
      partnerCounts[p4][p3]++;

      for (const a of [p1, p2]) {
        for (const b of [p3, p4]) {
          oppCounts[a][b]++;
          oppCounts[b][a]++;
        }
      }

      gamesPlayed[p1]++;
      gamesPlayed[p2]++;
      gamesPlayed[p3]++;
      gamesPlayed[p4]++;
    }

    rounds.push({
      matches: roundMatches,
      bye: byes.length > 0 ? byes[0] : undefined,
    });
  }

  return rounds;
}
