import { Test, TestingModule } from '@nestjs/testing';
import { Player } from '../player/player.entity';
import { PlayerService } from '../player/player.service';
import { CacheGameRepository } from './game-cache.repository';
import { GameController } from './game.controller';
import { Game } from './game.entity';
import { GameService } from './game.service';

class PlayerServiceMock extends PlayerService { }
class CacheGameRepositoryMock extends CacheGameRepository { }

describe('GameController', () => {
    let controller: GameController;
    let gameService: GameService;
    const playerService: PlayerService = new PlayerServiceMock();
    const cacheGameRepository: CacheGameRepository = new CacheGameRepositoryMock;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [GameController],
            providers: [
                {
                    provide: GameService,
                    useValue: jest.fn(),
                },
                {
                    provide: PlayerService,
                    useValue: playerService,
                },
                {
                    provide: CacheGameRepository,
                    useValue: cacheGameRepository,
                },
            ],
        }).compile();

        controller = module.get<GameController>(GameController);
        gameService = module.get<GameService>(GameService);
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
