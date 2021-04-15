import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Player } from '../player/player.class';
import { PlayerService } from '../player/player.service';
import { AIService } from './ai.service';
import { Board } from './board';
import { CacheGameRepository } from './game-cache.repository';
import { DatabaseGameRepository } from './game-database.repository';
import { GamePlayer } from './game-player.entity';
import { Game, GameStatus } from './game.class';
import { GameEntity } from './game.entity';

export class CachedGame {
    public board: Board = new Board();
    public constructor(
        public game: GameEntity,
    ) { }
}
interface IGameService {
    createGame(): Game;
    addPlayerToGame(game: Game, player: Player, position: number): void;
    startGame(game: Game): void;
    nextPlayer(game: Game): void;
    validateMove(move: ICoords[]): boolean;
    playMove(gmae: Game, move: ICoords[]): void;
}

@Injectable()
export class GameService implements IGameService {
    public async loadGame(gameId: string): Promise<Game> {
        let game = this.cacheGameRepository.findOne(gameId);
        if (!game) {
            const gameEntity = await this.databaseGameRepository.findOne(gameId, {
                relations: ['gamePlayers', 'gamePlayers.player'],
            });
            if (!gameEntity) throw new NotFoundException(`No game found with id: ${gameId}`);
            game = DatabaseGameRepository.fromEntityToGame(gameEntity);
            this.cacheGameRepository.save(game);
        }
        return game;
    }

    public createGame(): Game {
        const game = new Game();
        this.cacheGameRepository.save(game);
        return game;
    }

    public addPlayerToGame(game: Game, player: Player, position: number): void {
        if (!this.isPositionAvailable(game, position)) throw new BadRequestException('Position not available');
        if (!this.isNicknameAvailable(game, player.nickname)) throw new BadRequestException('Nickname already taken');
        if (!game.creator) game.creator = position;
        game.players[position] = player;
    }

    public startGame(game: Game): void {
        for (let i = 0; i < 6; i++) {
            let player = game.players[i];
            if (!player) {
                player = new Player();
                player.isBot = true;
                player.nickname = 'AI';
                player.online = true;
                game.players[i] = player;
            }
        }
        game.addListener('CURRENT_PLAYER', () => {
            if (game.players[game.getCurrentPlayer()].isBot) {
                setImmediate(() => this.playMove(game, this.aiService.play(game)));
            }
        });
        game.status = GameStatus.STARTED;
        game.nextPlayer();
    }

    public nextPlayer(game: Game): void {
        throw new Error('Method not implemented.');
    }

    public validateMove(move: ICoords[]): boolean {
        throw new Error('Method not implemented.');
    }

    public async playMove(game: Game, move: ICoords[]): Promise<void> {
        game.moves.push(move);
        if (move[0]) {
            game.board.getCell(move[0]).setPawn(undefined);
            game.board.getCell(move[move.length - 1]).setPawn(game.getCurrentPlayer());
        }
        if (game.board.isWinner(game.getCurrentPlayer())) {
            await this.endGame(game);
        } else {
            game.nextPlayer();
        }
    }

    public async endGame(game: Game) {
        game.status = GameStatus.FINISHED;
        game.winner = game.getCurrentPlayer();
        const playerEntities = [];
        for (let i = 0; i < 6; i++) {
            const player = game.players[i];
            if (player.isBot) continue;
            if (game.winner === i) {
                player.wins++;
            } else {
                player.loses++;
            }
            await this.playerService.updatePLayer(player);
            playerEntities[i] = player;
        }
        const gameEntity = await this.databaseGameRepository.saveFinished(game);
        gameEntity.creator = playerEntities[game.creator];
        gameEntity.winner = playerEntities[game.winner];
        gameEntity.gamePlayers = playerEntities.map((playerEntity, index) => {
            const gamePlayer = new GamePlayer();
            gamePlayer.game = gameEntity;
            gamePlayer.player = playerEntity;
            gamePlayer.position = index;
            return gamePlayer;
        });
        await this.databaseGameRepository.save(gameEntity);
    }

    @Inject(DatabaseGameRepository)
    private readonly databaseGameRepository: DatabaseGameRepository;

    @Inject(CacheGameRepository)
    private readonly cacheGameRepository: CacheGameRepository;

    @Inject(AIService)
    private readonly aiService: AIService;

    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    private readonly logger: Logger = new Logger(GameService.name);

    private isPositionAvailable(game: Game, position: number): boolean {
        if (game.players[position]) {
            return false;
        }
        return true;
    }

    private isNicknameAvailable(game: Game, nickname: string): boolean {
        if (game.players.find((player) => player.nickname === nickname)) {
            return false;
        }
        return true;
    }
}