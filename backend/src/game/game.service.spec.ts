import { Test, TestingModule } from '@nestjs/testing';
import { Player } from '../player/player.class';
import { PlayerService } from '../player/player.service';
import { AIService } from './ai.service';
import { BoardService } from './board.service';
import { CacheGameRepository } from './game-cache.repository';
import { DatabaseGameRepository } from './game-database.repository';
import { Game } from './game.class';
import { GameService } from './game.service';

class DatabaseGameRepositoryMock extends DatabaseGameRepository { }
class CacheGameRepositoryMock extends CacheGameRepository { }
class AIServiceMock extends AIService { }
class BoardServiceMock extends BoardService { }
class PlayerServiceMock extends PlayerService { }

describe('GameService', () => {
    let service: GameService;
    const gameRepository: DatabaseGameRepository = new DatabaseGameRepositoryMock;
    const cacheGameRepository: CacheGameRepository = new CacheGameRepositoryMock;
    const aiService: AIService = new AIServiceMock;
    const playerService: PlayerService = new PlayerServiceMock;
    const boardService: BoardService = new BoardServiceMock();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GameService,
                {
                    provide: DatabaseGameRepository,
                    useValue: gameRepository,
                },
                {
                    provide: CacheGameRepository,
                    useValue: cacheGameRepository,
                },
                {
                    provide: AIService,
                    useValue: aiService,
                },
                {
                    provide: BoardService,
                    useValue: boardService,
                },
                {
                    provide: PlayerService,
                    useValue: playerService,
                },
            ],
        }).compile();

        service = module.get<GameService>(GameService);
    });

    describe('addPlayerToGame', () => {
        it('should test if color available', () => {
            const game = new Game();
            game.players[2] = new Player();
            const player = new Player();

            expect(() => service.addPlayerToGame(game, player, 0)).toThrow();
        });
    });
    describe('startGame', () => {
        it('should fill a game with bots', async () => {
            const game = new Game();
            game.addListener = jest.fn();

            service.startGame(game);
            expect(game.players).toHaveLength(6);
        });
    });
});

