import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PlayerRepository } from './player-mogoose.repository';
import { IPlayerRepository } from './player-repository.interface';
import { Player } from './player.class';

interface IPlayerService {
    upsertPlayer(nickname: string): Promise<Player>;
}
@Injectable()
export class PlayerService implements IPlayerService {

    public constructor(
        @Inject(PlayerRepository)
        private readonly playerRepository: IPlayerRepository
    ) { }

    public async upsertPlayer(nickname: string): Promise<Player> {
        let player = await this.playerRepository.findOneByNickname(nickname);
        if (!player) {
            player = new Player(nickname);
            await this.playerRepository.save(player);
        }
        return player;
    }

    public async findByRating(): Promise<Player[]> {
        return this.playerRepository.findByRating();
    }

    public async updatePLayer(player: Player): Promise<void> {
        if (player.isBot) return;
        const existingPlayer = await this.playerRepository
            .update(player.nickname, player);

        if (!existingPlayer) throw new NotFoundException(`Player ${player.nickname} does not exist`);
    }

    public generateBot(): Player {
        const bot = new Player('AI');
        bot.isBot = true;
        bot.online = true;
        return bot;
    }
}
