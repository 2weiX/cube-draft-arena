
import { Player, Draft, Match, MatchResult } from '@/lib/types';

// Generate a random ID
export const generateId = () => Math.random().toString(36).substring(2, 15);

// Players mock data
export const mockPlayers: Player[] = [
  {
    id: "p1",
    name: "Jace Beleren",
    username: "mindsculptor",
    avatar: "https://i.imgur.com/1bwU0Mb.jpg",
    wins: 10,
    losses: 2,
    draws: 1,
    ranking: 1,
    createdAt: new Date("2024-01-15")
  },
  {
    id: "p2",
    name: "Liliana Vess",
    username: "deathmagic",
    avatar: "https://i.imgur.com/2jZhzY9.jpg",
    wins: 8,
    losses: 3,
    draws: 2,
    ranking: 2,
    createdAt: new Date("2024-01-16")
  },
  {
    id: "p3",
    name: "Chandra Nalaar",
    username: "pyromancer",
    avatar: "https://i.imgur.com/3jbSrAN.jpg",
    wins: 7,
    losses: 5,
    draws: 0,
    ranking: 3,
    createdAt: new Date("2024-01-17")
  },
  {
    id: "p4",
    name: "Nissa Revane",
    username: "worldwaker",
    avatar: "https://i.imgur.com/4qWkDAw.jpg",
    wins: 6,
    losses: 5,
    draws: 1,
    ranking: 4,
    createdAt: new Date("2024-01-18")
  },
  {
    id: "p5",
    name: "Gideon Jura",
    username: "justicar",
    avatar: "https://i.imgur.com/5pQfGNx.jpg",
    wins: 5,
    losses: 5,
    draws: 2,
    ranking: 5,
    createdAt: new Date("2024-01-19")
  },
  {
    id: "p6",
    name: "Sorin Markov",
    username: "bloodlord",
    avatar: "https://i.imgur.com/6vLqS2Y.jpg", 
    wins: 4,
    losses: 6,
    draws: 1,
    ranking: 6,
    createdAt: new Date("2024-01-20")
  },
  {
    id: "p7",
    name: "Teferi",
    username: "timemaster",
    avatar: "https://i.imgur.com/7xZrEfx.jpg",
    wins: 3,
    losses: 7,
    draws: 2,
    ranking: 7,
    createdAt: new Date("2024-01-21")
  },
  {
    id: "p8",
    name: "Kaya",
    username: "ghostassassin",
    avatar: "https://i.imgur.com/8mPdLVd.jpg",
    wins: 2,
    losses: 8,
    draws: 1,
    ranking: 8,
    createdAt: new Date("2024-01-22")
  }
];

// Draft mock data
export const mockDrafts: Draft[] = [
  {
    id: "d1",
    name: "Ravnica Cube Draft",
    description: "Classic Ravnica block cube featuring all 10 guilds",
    players: mockPlayers.map(p => p.id),
    seating: mockPlayers.map(p => p.id), // Added seating
    status: "completed",
    rounds: [
      {
        number: 1,
        matches: [
          {
            id: "m1",
            round: 1,
            draftId: "d1",
            player1: "p1",
            player2: "p8",
            player1Score: 2,
            player2Score: 0,
            result: "player1Win" as MatchResult,
            createdAt: new Date("2024-03-10T10:00:00"),
            completedAt: new Date("2024-03-10T10:45:00")
          },
          {
            id: "m2",
            round: 1,
            draftId: "d1",
            player1: "p2",
            player2: "p7",
            player1Score: 2,
            player2Score: 1,
            result: "player1Win" as MatchResult,
            createdAt: new Date("2024-03-10T10:00:00"),
            completedAt: new Date("2024-03-10T10:50:00")
          },
          {
            id: "m3",
            round: 1,
            draftId: "d1",
            player1: "p3",
            player2: "p6",
            player1Score: 1,
            player2Score: 2,
            result: "player2Win" as MatchResult,
            createdAt: new Date("2024-03-10T10:00:00"),
            completedAt: new Date("2024-03-10T10:40:00")
          },
          {
            id: "m4",
            round: 1,
            draftId: "d1",
            player1: "p4",
            player2: "p5",
            player1Score: 1,
            player2Score: 1,
            result: "draw" as MatchResult,
            createdAt: new Date("2024-03-10T10:00:00"),
            completedAt: new Date("2024-03-10T10:55:00")
          }
        ],
        completed: true
      },
      {
        number: 2,
        matches: [
          {
            id: "m5",
            round: 2,
            draftId: "d1",
            player1: "p1",
            player2: "p2",
            player1Score: 2,
            player2Score: 1,
            result: "player1Win" as MatchResult,
            createdAt: new Date("2024-03-10T11:00:00"),
            completedAt: new Date("2024-03-10T11:45:00")
          },
          {
            id: "m6",
            round: 2,
            draftId: "d1",
            player1: "p6",
            player2: "p4",
            player1Score: 0,
            player2Score: 2,
            result: "player2Win" as MatchResult,
            createdAt: new Date("2024-03-10T11:00:00"),
            completedAt: new Date("2024-03-10T11:35:00")
          },
          {
            id: "m7",
            round: 2,
            draftId: "d1",
            player1: "p8",
            player2: "p7",
            player1Score: 1,
            player2Score: 2,
            result: "player2Win" as MatchResult,
            createdAt: new Date("2024-03-10T11:00:00"),
            completedAt: new Date("2024-03-10T11:50:00")
          },
          {
            id: "m8",
            round: 2,
            draftId: "d1",
            player1: "p3",
            player2: "p5",
            player1Score: 2,
            player2Score: 0,
            result: "player1Win" as MatchResult,
            createdAt: new Date("2024-03-10T11:00:00"),
            completedAt: new Date("2024-03-10T11:40:00")
          }
        ],
        completed: true
      },
      {
        number: 3,
        matches: [
          {
            id: "m9",
            round: 3,
            draftId: "d1",
            player1: "p1",
            player2: "p4",
            player1Score: 2,
            player2Score: 0,
            result: "player1Win" as MatchResult,
            createdAt: new Date("2024-03-10T12:00:00"),
            completedAt: new Date("2024-03-10T12:40:00")
          },
          {
            id: "m10",
            round: 3,
            draftId: "d1",
            player1: "p3",
            player2: "p7",
            player1Score: 1,
            player2Score: 2,
            result: "player2Win" as MatchResult,
            createdAt: new Date("2024-03-10T12:00:00"),
            completedAt: new Date("2024-03-10T12:50:00")
          },
          {
            id: "m11",
            round: 3,
            draftId: "d1",
            player1: "p2",
            player2: "p6",
            player1Score: 2,
            player2Score: 1,
            result: "player1Win" as MatchResult,
            createdAt: new Date("2024-03-10T12:00:00"),
            completedAt: new Date("2024-03-10T12:45:00")
          },
          {
            id: "m12",
            round: 3,
            draftId: "d1",
            player1: "p5",
            player2: "p8",
            player1Score: 2,
            player2Score: 0,
            result: "player1Win" as MatchResult,
            createdAt: new Date("2024-03-10T12:00:00"),
            completedAt: new Date("2024-03-10T12:35:00")
          }
        ],
        completed: true
      }
    ],
    totalRounds: 3,
    currentRound: 3, // Add missing currentRound property
    createdAt: new Date("2024-03-10T09:30:00"),
    startedAt: new Date("2024-03-10T10:00:00"),
    completedAt: new Date("2024-03-10T13:00:00")
  },
  {
    id: "d2",
    name: "Innistrad Horror Cube",
    description: "Spooky cube featuring the best of Innistrad's horror themes",
    players: mockPlayers.slice(0, 8).map(p => p.id),
    seating: mockPlayers.slice(0, 8).map(p => p.id), // Added seating
    status: "pending",
    rounds: [],
    totalRounds: 3,
    currentRound: 0, // Add missing currentRound property
    createdAt: new Date("2024-04-22T18:30:00")
  }
];

// Create a flattened list of all matches
export const mockMatches: Match[] = mockDrafts
  .flatMap(draft => draft.rounds)
  .flatMap(round => round.matches);
