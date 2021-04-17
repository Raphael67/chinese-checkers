import { Schema } from 'mongoose';
import { GameStatus } from './game.entity';

export const gameSchema = new Schema({
    status: { type: GameStatus },
    turn: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    currentPlayer: { type: Number, default: -1 },
    creator: String,
    winner: String,
    players: { type: [String] },
    moves: { type: [[Schema.Types.Mixed]] },
    createdAt: { type: Date, default: Date.now },
});
