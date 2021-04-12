import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../player/player.entity';
import { GamePlayer } from './game-player.entity';
import { Game } from './game.entity';
import { GameRepository } from './game.repository';
import { GameService } from './game.service';
import { Move } from './move.entity';
import { MoveService } from './move.service';

class GameRepositoryMock extends GameRepository { }
class PlayerRepositoryMock extends Repository<Player> { }
class GamePlayerRepositoryMock extends Repository<GamePlayer> { }
class GameMovesRepositoryMock extends Repository<Move> { }
class MoveServiceMock extends MoveService { }

describe('GameService', () => {
    let service: GameService;
    const gameRepository: GameRepository = new GameRepositoryMock;
    const playerRepository: Repository<Player> = new PlayerRepositoryMock;
    const gamePlayerRepository: Repository<GamePlayer> = new GamePlayerRepositoryMock;
    const gameMovesRepository: Repository<Move> = new GameMovesRepositoryMock;
    const moveService: MoveService = new MoveServiceMock();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GameService,
                {
                    provide: GameRepository,
                    useValue: gameRepository,
                },
                {
                    provide: getRepositoryToken(Player),
                    useValue: playerRepository,
                },
                {
                    provide: getRepositoryToken(GamePlayer),
                    useValue: gamePlayerRepository,
                },
                {
                    provide: getRepositoryToken(Move),
                    useValue: gameMovesRepository,
                },
                {
                    provide: MoveService,
                    useValue: moveService,
                },
            ],
        }).compile();

        service = module.get<GameService>(GameService);
    });

    it('should test if color available', () => {
        const game = new Game();
        const gamePlayer = new GamePlayer();
        gamePlayer.position = 0;
        game.gamePlayers = [gamePlayer];

        expect(service.isPositionAvailable(game, 0)).toBeFalsy();
    });
    describe('start', () => {
        it('should fill a game with bots', async () => {
            const game = new Game();
            game.gamePlayers = [];

            let playerIndex = 0;
            playerRepository.findOne = jest.fn(async () => new Player((playerIndex++).toString()));
            gameRepository.save = jest.fn();
            gameRepository.update = jest.fn();
            gamePlayerRepository.save = jest.fn();

            await service.start(game);
            expect(game.gamePlayers).toHaveLength(6);
        });
    });
});
