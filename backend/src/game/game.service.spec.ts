import { Test, TestingModule } from '@nestjs/testing';
import { Player } from '../player/player.class';
import { PlayerService } from '../player/player.service';
import { GAME_SERVICE_EVENT_TOKEN } from './constants';
import { IGameEvents } from './game-events.interface';
import { Game, GameStatus } from './game.class';
import { GameRepository } from './game.repository';
import { GameService } from './game.service';

describe('GameService', () => {
    let service: GameService;
    let eventEmitter: IGameEvents;
    let gameRepository: GameRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GameService,
                {
                    provide: GameRepository,
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
        gameRepository = module.get(GameRepository);
    });

    describe('find', () => {
        it('should return a list of games', async () => {
            gameRepository.find = jest.fn(async () => []);
            await expect(service.find()).resolves.toBeInstanceOf(Array);
        });
    });
    describe('loadGame', () => {
        it('should load a game in memeory', async () => {
            const game = new Game();
            gameRepository.findOne = jest.fn(async () => game);
            await expect(service.loadGame('GAME_ID')).resolves.toBe(game);
        });
    });
    describe('startGame', () => {
        it('should create a new game', async () => {
            gameRepository.save = jest.fn();
            await service.createGame();
            expect(gameRepository.save).toHaveBeenCalled();
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
            await service.startGame(game);

            gameRepository.update = jest.fn();
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
            await service.startGame(game);

            const endedGame = await service.endGame(game);
            expect(endedGame.status).toBe(GameStatus.FINISHED);
        });
    });
});

