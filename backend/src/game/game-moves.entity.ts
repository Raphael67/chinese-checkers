import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { Game } from './game.entity';

export interface IMoves {
    moves: number[][][];
}

@Entity({ name: 'game_moves' })
export class GameMoves {
    @PrimaryColumn({ name: 'game_id', type: 'char', length: 36 })
    public gameId: string;

    @Column({ type: 'json' })
    public moves: IMoves;

    @OneToOne(() => Game, game => game.moves)
    public game: Game;
}