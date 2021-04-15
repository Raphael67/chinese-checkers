import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerEntity } from '../player/player.entity';
import { BoardService } from './board.service';
import { GameRepository } from './game-database.repository';
import { GamePlayer } from './game-player.entity';
import { GameEntity } from './game.entity';
import { GameService } from './game.service';
import { Move } from './move.entity';

class GameRepositoryMock extends GameRepository { }
class PlayerRepositoryMock extends Repository<PlayerEntity> { }
class GamePlayerRepositoryMock extends Repository<GamePlayer> { }
class GameMovesRepositoryMock extends Repository<Move> { }
class BoardServiceMock extends BoardService { }

describe('GameService', () => {
    let service: GameService;
    const gameRepository: GameRepository = new GameRepositoryMock;
    const playerRepository: Repository<PlayerEntity> = new PlayerRepositoryMock;
    const gamePlayerRepository: Repository<GamePlayer> = new GamePlayerRepositoryMock;
    const gameMovesRepository: Repository<Move> = new GameMovesRepositoryMock;
    const boardService: BoardService = new BoardServiceMock();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GameService,
                {
                    provide: GameRepository,
                    useValue: gameRepository,
                },
                {
                    provide: getRepositoryToken(PlayerEntity),
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
                    provide: BoardService,
                    useValue: boardService,
                },
            ],
        }).compile();

        service = module.get<GameService>(GameService);
    });

    it('should test if color available', () => {
        const game = new GameEntity();
        const gamePlayer = new GamePlayer();
        gamePlayer.position = 0;
        game.gamePlayers = [gamePlayer];

        expect(service.isPositionAvailable(game, 0)).toBeFalsy();
    });
    describe('start', () => {
        it('should fill a game with bots', async () => {
            const game = new GameEntity();
            game.gamePlayers = [];

            let playerIndex = 0;
            playerRepository.findOne = jest.fn(async () => new PlayerEntity((playerIndex++).toString()));
            gameRepository.save = jest.fn();
            gameRepository.update = jest.fn();
            gamePlayerRepository.save = jest.fn();

            await service.start(game);
            expect(game.gamePlayers).toHaveLength(6);
        });
    });
});
