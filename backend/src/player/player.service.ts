import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './player.class';
import { PlayerEntity } from './player.entity';
import { PlayerRepository } from './player.repository';

interface IPlayerService {
    upsertPlayer(nickname: string): Promise<Player>;
}
@Injectable()
export class PlayerService implements IPlayerService {
    public async upsertPlayer(nickname: string): Promise<Player> {
        let playerEntity = await this.playerRepository.findOne({ nickname });
        if (!playerEntity) {
            playerEntity = await this.playerRepository.save(new PlayerEntity(nickname));
        }
        const player = PlayerRepository.fromEntityToPlayer(playerEntity);
        return player;
    }

    public findByRating(): Promise<PlayerEntity[]> {
        return this.playerRepository.find({
            order: {
                rating: 'DESC',
            },
        });
    }

    public async updatePLayer(player: Player): Promise<PlayerEntity> {
        const playerEntity = await this.playerRepository.preload(PlayerRepository.fromPlayerToEntity(player));
        return await this.playerRepository.save(playerEntity);
    }

    @InjectRepository(PlayerEntity)
    private readonly playerRepository: Repository<PlayerEntity>;
}
