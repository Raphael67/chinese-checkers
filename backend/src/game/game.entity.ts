import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Move } from '../play/move.entity';
import { Player } from '../player/player.entity';
import { GamePlayer } from './game-player.entity';

export enum GameStatus {
    CREATED = "CREATED",
    IN_PROGRESS = "IN_PROGRESS",
    TERMINATED = "TERMINATED",
}

@Entity()
export class Game {
    @PrimaryColumn('uuid')
    public readonly id: string = uuid();

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

    @ManyToOne(() => Player, player => player.winnedGames)
    @JoinColumn({
        name: 'winner',
        referencedColumnName: 'id'
    })
    public winner: Player;

    @ManyToOne(() => Player, player => player.createdGames)
    @JoinColumn({
        name: 'creator',
        referencedColumnName: 'id'
    })
    public creator: Player;

    @OneToMany(() => GamePlayer, gamePlayer => gamePlayer.game)
    public gamePlayers: GamePlayer[];

    @OneToOne(() => Move, gameMoves => gameMoves.game)
    public moves: Move;
}