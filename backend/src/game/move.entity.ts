import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GameEntity } from '../game/game.entity';
import { Coords } from './board';

@Entity({ name: 'move' })
export class Move {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ name: 'game_id', type: 'char', length: 36 })
    public gameId: string;

    @Column({ name: 'move_index' })
    public moveIndex: number;

    @Column({ type: 'json' })
    public path: Coords[];

    @OneToOne(() => GameEntity, game => game.moves)
    @JoinColumn({ name: 'game_id', referencedColumnName: 'id' })
    public game: GameEntity;
}