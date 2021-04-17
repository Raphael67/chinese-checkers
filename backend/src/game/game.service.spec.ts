import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter } from 'events';
import { Player } from '../player/player.entity';
import { PlayerService } from '../player/player.service';
import { CacheGameRepository } from './game-cache.repository';
import { Game } from './game.entity';
import { GAME_SERVICE_EVENT_TOKEN } from './game.module';
import { GameService } from './game.service';

class CacheGameRepositoryMock extends CacheGameRepository { }
class PlayerServiceMock extends PlayerService { }

describe('GameService', () => {
    let service: GameService;
    const cacheGameRepository: CacheGameRepository = new CacheGameRepositoryMock;
    const playerService: PlayerService = new PlayerServiceMock;
    const eventEmitter: EventEmitter = new EventEmitter();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: CacheGameRepository,
                    useValue: cacheGameRepository,
                },
                {
                    provide: PlayerService,
                    useValue: playerService,
                },
                {
                    provide: GAME_SERVICE_EVENT_TOKEN,
                    useValue: eventEmitter,
                },
                {
                    provide: GameService,
                    useFactory: (eventEmitter: EventEmitter, playerService: PlayerService, cacheGameRepository: CacheGameRepository) => {
                        return new GameService(
                            cacheGameRepository,
                            playerService,
                            eventEmitter,
                        );
                    },
                    inject: [
                        GAME_SERVICE_EVENT_TOKEN,
                        PlayerService,
                        CacheGameRepository,
                    ],
                },
            ],
        }).compile();

        service = module.get<GameService>(GameService);
    });

    describe('addPlayerToGame', () => {
        it('should throw if color not available', () => {
            const game = new Game();
            game.players[2] = new Player('');
            const player = new Player('');

            expect(() => service.addPlayerToGame(game, player, 3)).toThrow();
        });
    });
    describe('startGame', () => {
        it('should fill a game with bots', async () => {
            const game = new Game();

            service.startGame(game);
            expect(game.players).toHaveLength(6);
        });
    });
});

