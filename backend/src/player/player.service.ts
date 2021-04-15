import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './player.class';
import { botNicknames, PlayerEntity } from './player.entity';
import { PlayerRepository } from './player.repository';

interface IPlayerService {
    upsertPlayer(nickname: string): Promise<Player>;
}
@Injectable()
export class PlayerService implements IPlayerService {
    public async upsertPlayer(nickname: string): Promise<Player> {
        let playerEntitie = await this.playerRepository.findOne({ nickname });
        if (!playerEntitie) {
            playerEntitie = await this.playerRepository.save(new PlayerEntity(nickname));
        }
        const player = PlayerRepository.fromEntityToPlayer(playerEntitie);
        return player;
    }

    @InjectRepository(PlayerEntity) private readonly playerRepository: Repository<PlayerEntity>;

    public findByRating(): Promise<PlayerEntity[]> {
        return this.playerRepository.find({
            order: {
                rating: 'DESC',
            },
        });
    }

    public findOneByNickname(nickname: string): Promise<PlayerEntity> {
        return this.playerRepository.findOne({
            where: {
                nickname,
            },
        });
    }

    public async createPlayer(nickname: string): Promise<PlayerEntity> {
        if (botNicknames.includes(nickname)) throw new BadRequestException('This nickname is reserved');
        const player = new PlayerEntity(nickname);
        return await this.playerRepository.save(player);
    }
}
