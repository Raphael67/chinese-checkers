import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GamePlayer } from '../game/game-player.entity';
import { Game } from '../game/game.entity';

@Entity()
export class Player {
    @PrimaryGeneratedColumn()
    public readonly id: number;

    @Column({ length: 32, unique: true })
    public nickname: string;

    @Column({ name: 'created_at' })
    public readonly createdAt: Date = new Date();

    @Column({ name: 'updated_at' })
    public readonly updatedAt: Date;

    @Column()
    public win: number;

    @Column()
    public lose: number;

    @Column()
    public readonly rating: number;

    @OneToMany(() => GamePlayer, gamePlayer => gamePlayer.player)
    @JoinColumn({ name: 'player_id', referencedColumnName: 'id' })
    public gamePlayers: GamePlayer[];

    @OneToMany(() => Game, game => game.winner)
    @JoinColumn({
        name: 'winner',
        referencedColumnName: 'id'
    })
    public winnedGames: Game[];

    @ManyToMany(() => Game, game => game.players)
    @JoinTable({
        name: 'game_player',
        joinColumn: { name: 'player_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'game_id', referencedColumnName: 'id' },
    })
    public games: Game[];

    @OneToMany(() => Game, game => game.creator)
    @JoinColumn({
        name: 'creator',
        referencedColumnName: 'id'
    })
    public createdGames: Game[];
}