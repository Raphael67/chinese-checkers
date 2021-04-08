import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '../game/game.entity';
import { Move } from '../game/move.entity';

@Injectable()
export class MoveService {
    @InjectRepository(Move)
    private readonly moveRepository: Repository<Move>;

    public findByGame(game: Game): Promise<Move[]> {
        return this.moveRepository.find({
            where: {
                gameId: game.id
            },
            order: {
                moveIndex: 'ASC'
            }
        });
    }

}
