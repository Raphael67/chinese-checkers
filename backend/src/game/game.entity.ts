import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Player } from '../player/player.entity';

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

    @ManyToMany(() => Player, player => player.games, { cascade: true })
    @JoinTable({
        name: 'game_player',
        joinColumn: {
            name: 'game_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'player_id',
            referencedColumnName: 'id',
        },
    })
    public players: Player[];
}