import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameService } from '../game/game.service';
import { MoveController } from './move.controller';
import { Move } from './move.entity';
import { MoveService } from './move.service';

class GameServiceMock extends GameService { }
class MoveServiceMock extends MoveService { }
class MoveRepositoryMock extends Repository<Move> { }

describe('MoveController', () => {
    let controller: MoveController;
    let gameService: GameService = new GameServiceMock();
    let moveService: MoveService = new MoveServiceMock();
    let moveRepository: Repository<Move> = new MoveRepositoryMock();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MoveController],
            providers: [
                {
                    provide: GameService,
                    useValue: gameService
                },
                {
                    provide: MoveService,
                    useValue: moveService
                },
                {
                    provide: getRepositoryToken(Move),
                    useValue: moveRepository
                }
            ]
        }).compile();

        controller = module.get<MoveController>(MoveController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
