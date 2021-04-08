import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../player/player.entity';
import { GameMoves } from './game-moves.entity';
import { Color, GamePlayer } from './game-player.entity';
import { Game } from './game.entity';
import { GameRepository } from './game.repository';
import { GameService } from './game.service';

class GameRepositoryMock extends GameRepository { };
class PlayerRepositoryMock extends Repository<Player> { };
class GamePlayerRepositoryMock extends Repository<GamePlayer> { };
class GameMovesRepositoryMock extends Repository<GameMoves> { };

describe('GameService', () => {
    let service: GameService;
    let gameRepository: GameRepository = new GameRepositoryMock;
    let playerRepository: Repository<Player> = new PlayerRepositoryMock;
    let gamePlayerRepository: Repository<GamePlayer> = new GamePlayerRepositoryMock;
    let gameMovesRepository: Repository<GameMoves> = new GameMovesRepositoryMock;

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
                    provide: getRepositoryToken(GameMoves),
                    useValue: gameMovesRepository,
                },
            ],
        }).compile();

        service = module.get<GameService>(GameService);
    });

    it('should test if color available', () => {
        const game = new Game();
        const gamePlayer = new GamePlayer();
        gamePlayer.color = Color.RED;
        game.gamePlayers = [gamePlayer];

        expect(service.isColorAvailable(game, Color.RED)).toBeFalsy();
    });
});
