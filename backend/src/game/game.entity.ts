import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { PlayerEntity } from '../player/player.entity';
import { GamePlayer } from './game-player.entity';
import { GameStatus } from './game.class';
import { Move } from './move.entity';

@Entity('game')
export class GameEntity {
    @PrimaryColumn('uuid')
    public readonly id: string;

    @Column('enum', { name: 'status', enum: GameStatus })
    public status: GameStatus = GameStatus.CREATED;

    @Column({ name: 'created_at' })
    public readonly createdAt: Date = new Date();

    @Column({ name: 'updated_at' })
    public readonly updatedAt: Date;

    @Column()
    public rounds: number = 1;

    @Column({ name: 'longest_streak' })
    public longestStreak: number = 0;

    @ManyToOne(() => PlayerEntity, player => player.winnedGames)
    @JoinColumn({
        name: 'winner',
        referencedColumnName: 'id',
    })
    public winner: PlayerEntity;

    @ManyToOne(() => PlayerEntity, player => player.createdGames)
    @JoinColumn({
        name: 'creator',
        referencedColumnName: 'id',
    })
    public creator: PlayerEntity;

    @OneToMany(() => GamePlayer, gamePlayer => gamePlayer.game)
    @JoinColumn({ name: 'game_id', referencedColumnName: 'id' })
    public gamePlayers: GamePlayer[];

    @OneToMany(() => Move, gameMoves => gameMoves.game)
    public moves: Move[];
}