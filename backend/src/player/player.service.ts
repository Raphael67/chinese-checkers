import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import PlayerRepository from './player-mogoose.repository';
import { IPlayerRepository } from './player-repository.interface';
import { Player } from './player.class';

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
        return this.playerCacheRepository.findByRating();
    }

    public async updatePLayer(player: Player): Promise<Player> {
        if (player.isBot) return;
        const existingPlayer = await this.playerCacheRepository
            .update(player.nickname, player);

        if (!existingPlayer) throw new NotFoundException(`Player ${existingPlayer.nickname} does not exist`);
        return existingPlayer;
    }

    @Inject(PlayerRepository)
    private readonly playerCacheRepository: IPlayerRepository;

}
