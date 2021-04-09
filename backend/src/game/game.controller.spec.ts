import { Test, TestingModule } from '@nestjs/testing';
import { MoveService } from '../play/move.service';
import { Player } from '../player/player.entity';
import { PlayerService } from '../player/player.service';
import { Color } from './game-player.entity';
import { GameController } from './game.controller';
import { Game } from './game.entity';
import { RequestWithGame } from './game.guard';
import { GameService } from './game.service';

class GameServiceMock extends GameService { }
class PlayerServiceMock extends PlayerService { }
class MoveServiceMock extends MoveService { }

describe('GameController', () => {
    let controller: GameController;
    let gameService: GameService = new GameServiceMock();
    let playerService: PlayerService = new PlayerServiceMock();
    let moveService: MoveService = new MoveServiceMock();

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
                    provide: MoveService,
                    useValue: moveService,
                }
            ],
        }).compile();

        controller = module.get<GameController>(GameController);
    });

    describe('linkPlayerToGame', () => {
        it('should 403 if color already taken', async () => {
            const playerDto = { nickname: 'TEST', color: Color.BLACK };
            const request: RequestWithGame = { game: new Game() } as RequestWithGame;

            gameService.isColorAvailable = jest.fn(() => false);

            await expect(controller.upsertPlayerToGame(playerDto, request)).rejects.toThrowError('This color is already taken in this game');
        });
        it('should 403 if nickname already taken', async () => {
            const playerDto = { nickname: 'TEST', color: Color.BLACK };
            const request: RequestWithGame = { game: new Game() } as RequestWithGame;

            gameService.isColorAvailable = jest.fn(() => true);
            gameService.isNicknameAvailable = jest.fn(() => false);

            await expect(controller.upsertPlayerToGame(playerDto, request)).rejects.toThrowError('This nickname is already taken in this game');
        });
        it('should create player if it does not exist', async () => {
            const playerDto = { nickname: 'TEST', color: Color.BLACK };
            const request: RequestWithGame = { game: new Game() } as RequestWithGame;

            gameService.isColorAvailable = jest.fn(() => true);
            gameService.isNicknameAvailable = jest.fn(() => true);
            playerService.findOneByNickname = jest.fn(() => null);
            playerService.createPlayer = jest.fn();
            gameService.linkPlayerToGame = jest.fn();

            await controller.upsertPlayerToGame(playerDto, request);

            expect(playerService.createPlayer).toHaveBeenCalledTimes(1);
        });
        it('should link player to game', async () => {
            const playerDto = { nickname: 'TEST', color: Color.BLACK };
            const player = new Player();
            const game = new Game();

            const request: RequestWithGame = { game } as RequestWithGame;

            gameService.isColorAvailable = jest.fn(() => true);
            gameService.isNicknameAvailable = jest.fn(() => true);
            playerService.findOneByNickname = jest.fn(async () => player);
            gameService.linkPlayerToGame = jest.fn();

            await controller.upsertPlayerToGame(playerDto, request);

            expect(gameService.linkPlayerToGame).toHaveBeenCalledWith(game, player, playerDto.color);
        });
    });

});
