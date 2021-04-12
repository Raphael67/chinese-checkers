import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Player } from '../player/player.entity';
import { Game } from './game.entity';

@Entity({ name: 'game_player' })
export class GamePlayer {
    @PrimaryColumn({ name: 'player_id' })
    public playerId: number;

    @PrimaryColumn({ name: 'game_id' })
    public gameId: string;

    @Column()
    public position: number;

    @ManyToOne(() => Player, player => player.gamePlayers)
    @JoinColumn({ name: 'player_id', referencedColumnName: 'id' })
    public player: Player;

    @ManyToOne(() => Game, game => game.gamePlayers, { cascade: false })
    @JoinColumn({ name: 'game_id', referencedColumnName: 'id' })
    public game: Game;
}