import { Test, TestingModule } from '@nestjs/testing';
import { PlayerEntity } from '../player/player.entity';
import { PlayerService } from '../player/player.service';
import { GameController } from './game.controller';
import { GameEntity } from './game.entity';
import { RequestWithGame } from './game.guard';
import { GameService } from './game.service';

class GameServiceMock extends GameService { }
class PlayerServiceMock extends PlayerService { }

describe('GameController', () => {
    let controller: GameController;
    const gameService: GameService = new GameServiceMock();
    const playerService: PlayerService = new PlayerServiceMock();

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
            ],
        }).compile();

        controller = module.get<GameController>(GameController);
    });

    describe('linkPlayerToGame', () => {
        it('should 403 if color already taken', async () => {
            const playerDto = { nickname: 'TEST', position: 0 };
            const request: RequestWithGame = { game: new GameEntity() } as RequestWithGame;

            gameService.isPositionAvailable = jest.fn(() => false);

            await expect(controller.upsertPlayerToGame(playerDto, request)).rejects.toThrowError('This color is already taken in this game');
        });
        it('should 403 if nickname already taken', async () => {
            const playerDto = { nickname: 'TEST', position: 0 };
            const request: RequestWithGame = { game: new GameEntity() } as RequestWithGame;

            gameService.isPositionAvailable = jest.fn(() => true);
            gameService.isNicknameAvailable = jest.fn(() => false);

            await expect(controller.upsertPlayerToGame(playerDto, request)).rejects.toThrowError('This nickname is already taken in this game');
        });
        it('should create player if it does not exist', async () => {
            const playerDto = { nickname: 'TEST', position: 0 };
            const request: RequestWithGame = { game: new GameEntity() } as RequestWithGame;

            gameService.isPositionAvailable = jest.fn(() => true);
            gameService.isNicknameAvailable = jest.fn(() => true);
            playerService.findOneByNickname = jest.fn(() => null);
            playerService.createPlayer = jest.fn();
            gameService.linkPlayerToGame = jest.fn();

            await controller.upsertPlayerToGame(playerDto, request);

            expect(playerService.createPlayer).toHaveBeenCalledTimes(1);
        });
        it('should link player to game', async () => {
            const playerDto = { nickname: 'TEST', position: 0 };
            const player = new PlayerEntity('TEST');
            const game = new GameEntity();

            const request: RequestWithGame = { game } as RequestWithGame;

            gameService.isPositionAvailable = jest.fn(() => true);
            gameService.isNicknameAvailable = jest.fn(() => true);
            playerService.findOneByNickname = jest.fn(async () => player);
            gameService.linkPlayerToGame = jest.fn();

            await controller.upsertPlayerToGame(playerDto, request);

            expect(gameService.linkPlayerToGame).toHaveBeenCalledWith(game, player, playerDto.position);
        });
    });

});
