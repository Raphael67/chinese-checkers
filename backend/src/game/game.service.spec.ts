import { Test, TestingModule } from '@nestjs/testing';
import { Player } from '../player/player.class';
import { PlayerService } from '../player/player.service';
import { GAME_SERVICE_EVENT_TOKEN } from './constants';
import { GameCacheRepository } from './game-cache.repository';
import { IGameEvents } from './game-events.interface';
import { GameMongooseRepository } from './game-mongoose.repository';
import { Game, GameStatus } from './game.class';
import { GameService } from './game.service';

describe('GameService', () => {
    let service: GameService;
    let eventEmitter: IGameEvents;
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
                {
                    provide: GAME_SERVICE_EVENT_TOKEN,
                    useValue: {},
                },
            ],
        }).compile();

        service = module.get<GameService>(GameService);
        eventEmitter = module.get(GAME_SERVICE_EVENT_TOKEN);
        gameCacheRepository = module.get(GameCacheRepository);
        gameMongooseRepository = module.get(GameMongooseRepository);
        playerService = module.get(PlayerService);
    });

    describe('find', () => {
        it('should return a list of games', async () => {
            gameMongooseRepository.find = jest.fn(async () => []);
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
    describe('startGame', () => {
        it('should fill a game with bots', async () => {
            const game = new Game();
            eventEmitter.on = jest.fn();
            eventEmitter.emit = jest.fn();
            gameMongooseRepository.save = jest.fn();

            await service.startGame(game);
            expect(game.players).toHaveLength(6);
        });
    });
    describe('joinGame', () => {
        it('should allow a player to join a game', async () => {
            const player = new Player('test');
            const game = new Game();
            game.players[3] = player;
            eventEmitter.emit = jest.fn();
            gameMongooseRepository.save = jest.fn();
            await service.startGame(game);
            expect(() => service.joinGame(game, 'test')).not.toThrow();
        });
    });
    describe('disconnectPlayer', () => {
        it('should disconnect a player from a game', async () => {
            const player = new Player('test');
            player.online = true;
            const game = new Game();
            game.players[3] = player;
            eventEmitter.emit = jest.fn();
            gameMongooseRepository.save = jest.fn();
            await service.startGame(game);

            service.disconnectPlayer(game, 'test');

            expect(game.players[3].online).toBeFalsy();
        });
    });
    describe('nextPlayer', () => {
        it('should go to the next player', async () => {
            const player1 = new Player('test1');
            const player2 = new Player('test2');
            const game = new Game();
            game.players[0] = player1;
            game.players[1] = player2;
            eventEmitter.emit = jest.fn();
            gameMongooseRepository.save = jest.fn();

            expect(game.currentPlayer).toBe(-1);
            await service.startGame(game);
            expect(game.currentPlayer).toBe(0);
            service.nextPlayer(game);
            expect(game.currentPlayer).toBe(1);
        });
    });
    describe('playMove', () => {
        it('should play a move', async () => {
            const player1 = new Player('test1');
            const player2 = new Player('test2');
            const game = new Game();
            game.players[0] = player1;
            game.players[1] = player2;
            eventEmitter.emit = jest.fn();
            gameMongooseRepository.save = jest.fn();
            await service.startGame(game);

            gameMongooseRepository.update = jest.fn();
            await service.playMove(game, []);
            expect(game.currentPlayer).toBe(1);
        });
    });
    describe('endGame', () => {
        it('should end a game', async () => {
            const player1 = new Player('test1');
            const player2 = new Player('test2');
            const game = new Game();
            game.players[0] = player1;
            game.players[1] = player2;
            eventEmitter.emit = jest.fn();
            gameMongooseRepository.save = jest.fn();
            gameMongooseRepository.update = jest.fn();
            playerService.updatePLayer = jest.fn();

            await service.startGame(game);

            const endedGame = await service.endGame(game);
            expect(endedGame.status).toBe(GameStatus.FINISHED);
        });
    });
});

