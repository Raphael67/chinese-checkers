import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Player } from '../player/player.entity';
import { Game } from './game.entity';

export enum Color {
    BLACK = "BLACK",
    BLUE = "BLUE",
    PURPLE = "PURPLE",
    YELLOW = "YELLOW",
    GREEN = "GREEN",
    RED = "RED",
}

@Entity({ name: 'game_player' })
export class GamePlayer {
    @PrimaryColumn({ name: 'player_id' })
    public playerId: number;

    @PrimaryColumn({ name: 'game_id' })
    public gameId: string;

    @Column({ enum: Color })
    public color: Color;

    @ManyToOne(() => Player, player => player.gamePlayers)
    @JoinColumn({ name: 'player_id', referencedColumnName: 'id' })
    public player: Player;

    @ManyToOne(() => Game, game => game.gamePlayers, { cascade: false })
    @JoinColumn({ name: 'game_id', referencedColumnName: 'id' })
    public game: Game;
}