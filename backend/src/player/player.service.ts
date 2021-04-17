import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PlayerCacheRepository } from './player-cache.repository';
import { Player } from './player.entity';

interface IPlayerService {
    upsertPlayer(nickname: string): Promise<Player>;
}
@Injectable()
export class PlayerService implements IPlayerService {

    public async upsertPlayer(nickname: string): Promise<Player> {
        let player = await this.playerCacheRepository.findOneByNickname(nickname);
        if (!player) {
            player = new Player(nickname);
            await this.playerCacheRepository.save(player);
        }
        return player;
    }

    public async findByRating(): Promise<Player[]> {
        return this.playerCacheRepository.find();
    }

    public async updatePLayer(player: Player): Promise<Player> {
        const existingPlayer = await this.playerCacheRepository
            .update(player.id, player);

        if (!existingPlayer) throw new NotFoundException(`Player ${existingPlayer.id} does not exist`);
        return existingPlayer;
    }

    @Inject(PlayerCacheRepository)
    private readonly playerCacheRepository: PlayerCacheRepository;

}
