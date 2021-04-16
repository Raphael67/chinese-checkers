import { Test, TestingModule } from '@nestjs/testing';
import { Player } from '../player/player.class';
import { PlayerService } from '../player/player.service';
import { DatabaseGameRepository } from './game-database.repository';
import { Game } from './game.class';
import { GameController } from './game.controller';
import { GameService } from './game.service';

class GameServiceMock extends GameService { }
class PlayerServiceMock extends PlayerService { }
class DatabaseGameRepositoryMock extends DatabaseGameRepository { }

describe('GameController', () => {
    let controller: GameController;
    const gameService: GameService = new GameServiceMock();
    const playerService: PlayerService = new PlayerServiceMock();
    const databaseGameRepository: DatabaseGameRepository = new DatabaseGameRepositoryMock();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [GameController],
            providers: [
                {
                    provide: GameService,
                    useValue: gameService,
                },
                {
                    provide: PlayerService,
                    useValue: playerService,
                },
                {
                    provide: DatabaseGameRepository,
                    useValue: databaseGameRepository,
                },
            ],
        }).compile();

        controller = module.get<GameController>(GameController);
    });

    describe('addPlayerToGame', () => {
        it('should add player to game', async () => {
            const gameId = 'GAME_ID';
            const playerDto = { nickname: 'TEST', position: 0 };
            const game = new Game();


            gameService.loadGame = jest.fn(async () => game);
            playerService.upsertPlayer = jest.fn(async () => new Player());

            await expect(controller.upsertPlayerToGame(gameId, playerDto)).resolves;
        });
    });

});
