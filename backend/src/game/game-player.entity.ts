import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { PlayerEntity } from '../player/player.entity';
import { GameEntity } from './game.entity';

@Entity({ name: 'game_player' })
export class GamePlayer {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ name: 'player_id' })
    public playerId: number;

    @Column({ name: 'game_id' })
    public gameId: string;

    @PrimaryColumn()
    public position: number;

    @ManyToOne(() => PlayerEntity, player => player.gamePlayers)
    @JoinColumn({ name: 'player_id', referencedColumnName: 'id' })
    public player: PlayerEntity;

    @ManyToOne(() => GameEntity, game => game.gamePlayers)
    @JoinColumn({ name: 'game_id', referencedColumnName: 'id' })
    public game: GameEntity;
}