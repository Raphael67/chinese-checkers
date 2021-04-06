import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
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

    @OneToMany(() => GamePlayer, gamePlayer => gamePlayer.game)
    public gamePlayers: GamePlayer[];
}