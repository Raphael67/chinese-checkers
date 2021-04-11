import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { botNicknames, Player } from './player.entity';

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

    public findOneByNickname(nickname: string): Promise<Player> {
        return this.playerRepository.findOne({
            where: {
                nickname
            }
        });
    }

    public async createPlayer(nickname: string): Promise<Player> {
        if (botNicknames.includes(nickname)) throw new BadRequestException('This nickname is reserved');
        const player = new Player();
        player.nickname = nickname;
        return await this.playerRepository.save(player);
    }
}
