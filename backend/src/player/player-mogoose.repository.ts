import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPlayerRepository } from './player-repository.interface';
import { Player } from './player.class';
import { PlayerEntity } from './player.entity';

export default class PlayerRepository implements IPlayerRepository {
    @InjectModel(PlayerEntity.name)
    private readonly playerModel!: Model<PlayerEntity>;

    private fromEntityToObject(playerEntity: PlayerEntity): Player {
        const player = new Player(playerEntity.nickname);
        player.isBot = false;
        player.longestStreak = playerEntity.longestStreak;
        player.loses = playerEntity.loses;
        player.online = false;
        player.rating = playerEntity.rating;
        player.wins = playerEntity.wins;
        return player;
    }

    public async findOneByNickname(nickname: string): Promise<Player | undefined> {
        const playerEntity = await this.playerModel.findOne({ nickname }).exec();
        if (!playerEntity) return undefined;
        return this.fromEntityToObject(playerEntity);
    }

    public async findByRating(): Promise<Player[]> {
        const playerEntities = await this.playerModel.find().sort({ rating: 'desc' }).limit(50).exec();
        return playerEntities.map(playerEntity => this.fromEntityToObject(playerEntity));
    }

    public async save(player: Player): Promise<void> {
        const playerEntity = new this.playerModel(player);
        await playerEntity.save();
    }

    public async update(nickname: string, playerData: Partial<Player>): Promise<Player> {
        const existingPlayer = await this.playerModel
            .findOneAndUpdate({ nickname }, { $set: playerData }, { new: true })
            .exec();
        if (!existingPlayer) throw new Error(`Player ${nickname} not found`);

        return this.fromEntityToObject(existingPlayer);
    }

}