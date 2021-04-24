import { Test, TestingModule } from '@nestjs/testing';
import { Player } from '../player/player.class';
import { PlayerService } from '../player/player.service';
import { GameDetailsDto } from './dto/game-details.dto';
import { GameCacheRepository } from './game-cache.repository';
import { Game } from './game.class';
import { GameController } from './game.controller';
import { GameService } from './game.service';

describe('GameController', () => {
    let controller: GameController;
    let gameService: GameService;
    let playerService: PlayerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [GameController],
            providers: [
                {
                    provide: GameService,
                    useValue: {},
                },
                {
                    provide: PlayerService,
                    useValue: {},
                },
                {
                    provide: GameCacheRepository,
                    useValue: {},
                },
            ],
        }).compile();

        controller = module.get<GameController>(GameController);
        gameService = module.get<GameService>(GameService);
        playerService = module.get<PlayerService>(PlayerService);
    });

    describe('getGames', () => {
        it('should return list of games', async () => {
            gameService.findFinishedGames = jest.fn(async () => []);
            await expect(controller.getGames()).resolves.toBeInstanceOf(Array);
        });
    });
    describe('getGame', () => {
        it('should return a game', async () => {
            const game = new Game();
            gameService.loadGame = jest.fn(async () => game);
            await expect(controller.getGame('GAME_ID')).resolves.toStrictEqual(new GameDetailsDto(game));
        });
    });
    describe('createGame', () => {
        it('should return a new game', async () => {
            const game = new Game();
            gameService.createGame = jest.fn(async () => game);
            await expect(controller.createGame()).resolves.toStrictEqual(new GameDetailsDto(game));
        });
    });
    describe('addPlayerToGame', () => {
        it('should add player to game', async () => {
            const gameId = 'GAME_ID';
            const playerDto = { nickname: 'TEST', position: 0 };
            const game = new Game();


            gameService.loadGame = jest.fn(async () => game);
            playerService.upsertPlayer = jest.fn(async () => new Player(''));
            gameService.addPlayerToGame = jest.fn(async () => { return; });

            await expect(controller.upsertPlayerToGame(gameId, playerDto)).resolves;
        });
    });

});
