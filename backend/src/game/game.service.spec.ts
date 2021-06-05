import { Test, TestingModule } from '@nestjs/testing';
import { Player } from '../player/player.class';
import { PlayerService } from '../player/player.service';
import { GameCacheRepository } from './game-cache.repository';
import { GameMongooseRepository } from './game-mongoose.repository';
import { Game, GameStatus } from './game.class';
import { GameService } from './game.service';

describe('GameService', () => {
    let service: GameService;
    let gameCacheRepository: GameCacheRepository;
    let gameMongooseRepository: GameMongooseRepository;
    let playerService: PlayerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GameService,
                {
                    provide: GameCacheRepository,
                    useValue: {},
                },
                {
                    provide: GameMongooseRepository,
                    useValue: {},
                },
                {
                    provide: PlayerService,
                    useValue: {},
                },
            ],
        }).compile();

        service = module.get<GameService>(GameService);
        gameCacheRepository = module.get(GameCacheRepository);
        gameMongooseRepository = module.get(GameMongooseRepository);
        playerService = module.get(PlayerService);
    });

    describe('find', () => {
        it('should return a list of games', async () => {
            gameMongooseRepository.findFinishedGame = jest.fn(async () => []);
            await expect(service.findFinishedGames()).resolves.toBeInstanceOf(Array);
        });
    });
    describe('loadGame', () => {
        it('should load a game in memeory', async () => {
            const game = new Game();
            gameCacheRepository.findOne = jest.fn(async () => game);
            await expect(service.loadGame('GAME_ID')).resolves.toBe(game);
        });
    });
    describe('startGame', () => {
        it('should create a new game', async () => {
            gameCacheRepository.save = jest.fn();
            await service.createGame();
            expect(gameCacheRepository.save).toHaveBeenCalled();
        });
    });
    describe('addPlayerToGame', () => {
        it('should throw if color not available', async () => {
            const game = new Game();
            game.players[2] = new Player('');
            const player = new Player('');

            await expect(service.addPlayerToGame(game, player, 2)).rejects.toThrow();
        });
    });
    describe('joinGame', () => {
        it('should allow a player to join a game', async () => {
            const player = new Player('test');
            const game = new Game();
            game.players[0] = new Player('');
            game.players[1] = new Player('');
            game.players[2] = new Player('');
            game.players[3] = player;
            game.players[4] = new Player('');
            game.players[5] = new Player('');
            gameMongooseRepository.save = jest.fn();
            expect(() => service.joinGame(game, 'test')).not.toThrow();
        });
    });
    describe('disconnectPlayer', () => {
        it('should disconnect a player from a game', async () => {
            const player = new Player('test');
            player.online = true;
            const game = new Game();
            game.players[0] = new Player('');
            game.players[1] = new Player('');
            game.players[2] = new Player('');
            game.players[3] = player;
            game.players[4] = new Player('');
            game.players[5] = new Player('');
            gameMongooseRepository.save = jest.fn();

            service.disconnectPlayer(game, 'test');

            expect(game.players[3].online).toBeFalsy();
        });
    });
    describe('endGame', () => {
        it('should end a game', async () => {
            const player1 = new Player('test1');
            const player2 = new Player('test2');
            const game = new Game();
            game.status = GameStatus.STARTED;
            game.currentPlayer = 0;
            game.players[0] = player1;
            game.players[1] = player2;
            game.players[2] = new Player('');
            game.players[3] = new Player('');
            game.players[4] = new Player('');
            game.players[5] = new Player('');
            gameMongooseRepository.save = jest.fn();
            gameMongooseRepository.update = jest.fn();
            playerService.updatePLayer = jest.fn();

            const endedGame = await service.endGame(game);
            expect(endedGame.status).toBe(GameStatus.FINISHED);
        });
    });
});

