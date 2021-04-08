import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Color, GamePlayer } from '../game/game-player.entity';
import { Game } from '../game/game.entity';
import { GameRepository } from '../game/game.repository';
import { Player } from '../player/player.entity';

@Injectable()
export class AccessService {
    @Inject(GameRepository)
    private readonly gameRepository: GameRepository;

    @InjectRepository(GamePlayer)
    private readonly gamePlayerRepository: Repository<GamePlayer>;

    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>;

    public async connect(gameId: string, requestingPlayer?: { nickname: string, color: Color; }): Promise<boolean> {
        const game = await this.validateGame(gameId);
        if (requestingPlayer) {
            const player = await this.validatePlayer(requestingPlayer.nickname);
            await this.validateColor(game, player, requestingPlayer.color);
        }
        return true;
    }

    private async validateColor(game: Game, player: Player, color: Color): Promise<GamePlayer> {
        const gamePlayer = await this.gamePlayerRepository.findOne({
            where: {
                game, player, color
            }
        });
        if (!gamePlayer) throw 'Color already taken by another player';
        return gamePlayer;
    }

    private async validatePlayer(nickname: string): Promise<Player> {
        const player = await this.playerRepository.findOne({
            where: { nickname }
        });
        if (!player) throw 'Unknown player nickname';
        return player;
    }

    private async validateGame(gameId: string): Promise<Game> {
        const game = await this.gameRepository.findOne(gameId);
        if (!game) throw 'Unknown game id';
        return game;
    }
}
