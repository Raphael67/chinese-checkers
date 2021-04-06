import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Game } from '../game/game.entity';

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

    @ManyToMany(() => Game, game => game.players)
    @JoinTable({
        name: 'game_player',
        joinColumn: {
            name: 'player_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'game_id',
            referencedColumnName: 'id',
        },
    })
    public games: Game[];
}