import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { Game } from '../game/game.entity';

@Entity({ name: 'move' })
export class Move {
    @PrimaryColumn({ name: 'game_id', type: 'char', length: 36 })
    public gameId: string;

    @PrimaryColumn({ name: 'move_index' })
    public moveIndex: number;

    @Column({ type: 'json' })
    public path: number[][];

    @OneToOne(() => Game, game => game.moves)
    public game: Game;
}