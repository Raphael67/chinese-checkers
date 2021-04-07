import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GamePlayer } from '../game/game-player.entity';

@Entity()
export class Player {
    @PrimaryGeneratedColumn()
    public readonly id: number;

    @Column({ length: 32 })
    public nickname: string;

    @Column({ name: 'created_at' })
    public readonly createdAt: Date = new Date();

    @Column({ name: 'updated_at' })
    public readonly updatedAt: Date;

    @OneToMany(() => GamePlayer, gamePlayer => gamePlayer.player)
    @JoinColumn({ name: 'player_id', referencedColumnName: 'id' })
    public gamePlayers: GamePlayer[];
}