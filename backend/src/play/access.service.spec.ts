import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Color, GamePlayer } from '../game/game-player.entity';
import { Game } from '../game/game.entity';
import { GameRepository } from '../game/game.repository';
import { Player } from '../player/player.entity';
import { AccessService } from './access.service';

class GameRepositoryMock extends GameRepository { }
class PlayerRepositoryMock extends Repository<Player> { }
class GamePlayerRepositoryMock extends Repository<GamePlayer> { }

describe('AccessService', () => {
    let service: AccessService;
    let gameRepository = new GameRepositoryMock();
    let playerRepository = new PlayerRepositoryMock();
    let gamePlayerRepository = new GamePlayerRepositoryMock();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AccessService,
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
            ],
        }).compile();

        service = module.get<AccessService>(AccessService);
    });

    it('should allow spectator connection', async () => {
        const gameId = 'GAME_ID';
        gameRepository.findOne = jest.fn<Promise<Game>, []>(async () => (new Game()));

        const connected = await service.connect(gameId);
        expect(connected).toBeTruthy();
    });
    it('should throw if gameId not found', async () => {
        const gameId = 'GAME_ID';
        gameRepository.findOne = jest.fn<Promise<Game>, []>(async () => null);
        await expect(service.connect(gameId)).rejects.toEqual('Unknown game id');
    });
    it('should throw if nickname not known', async () => {
        const gameId = 'GAME_ID';
        const nickname = 'wrong_nickname';
        const color = Color.RED;
        gameRepository.findOne = jest.fn<Promise<Game>, []>(async () => new Game());
        playerRepository.findOne = jest.fn<Promise<Player>, []>(async () => null);
        await expect(service.connect(gameId, { nickname, color })).rejects.toEqual('Unknown player nickname');
    });
    it('should throw if color already taken', async () => {
        const gameId = 'GAME_ID';
        const nickname = 'nickname';
        const color = Color.RED;
        gameRepository.findOne = jest.fn<Promise<Game>, []>(async () => new Game());
        playerRepository.findOne = jest.fn<Promise<Player>, []>(async () => new Player());
        gamePlayerRepository.findOne = jest.fn<Promise<GamePlayer>, []>(async () => null);
        await expect(service.connect(gameId, { nickname, color })).rejects.toEqual('Color already taken by another player');
    });
    it('should connect correct player', async () => {
        const gameId = 'GAME_ID';
        const nickname = 'nickname';
        const color = Color.RED;
        gameRepository.findOne = jest.fn<Promise<Game>, []>(async () => new Game());
        playerRepository.findOne = jest.fn<Promise<Player>, []>(async () => new Player());
        gamePlayerRepository.findOne = jest.fn<Promise<GamePlayer>, []>(async () => new GamePlayer());
        await expect(service.connect(gameId, { nickname, color })).resolves.toBeTruthy();
    });
});
