import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './player.entity';

@Injectable()
export class PlayerService {
    @InjectRepository(Player) private readonly playerRepository: Repository<Player>;

    public findByRating(): Promise<Player[]> {
        return this.playerRepository.find({
            order: {
                rating: 'DESC',
            }
        });
    }
}
