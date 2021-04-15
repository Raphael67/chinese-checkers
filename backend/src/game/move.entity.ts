import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { GameEntity } from '../game/game.entity';
import { Coords } from './board';

@Entity({ name: 'move' })
export class Move {
    @PrimaryColumn({ name: 'game_id', type: 'char', length: 36 })
    public gameId: string;

    @PrimaryColumn({ name: 'move_index' })
    public moveIndex: number;

    @Column({ type: 'json' })
    public path: Coords[];

    @OneToOne(() => GameEntity, game => game.moves)
    public game: GameEntity;
}