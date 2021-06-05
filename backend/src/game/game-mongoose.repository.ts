import { Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayerRepository } from '../player/player-mogoose.repository';
import { IGameRepository } from './game-repository.interface';
import { Game } from './game.class';
import { GameEntity } from './game.entity';

export class GameMongooseRepository implements IGameRepository {
    public constructor(
        @InjectModel(GameEntity.name)
        private readonly gameModel: Model<GameEntity>,
        @Inject(PlayerRepository)
        private readonly playerRepository: PlayerRepository,
    ) { }

    private async fromEntityToObject(gameEntity: GameEntity): Promise<Game> {
        const game = new Game();
        game.id = gameEntity.gameId;
        game.createdAt = gameEntity.createdAt;
        game.creator = gameEntity.creator;
        game.longestStreak = gameEntity.longestStreak;
        game.moves = gameEntity.moves;
        game.status = gameEntity.status;
        game.turn = gameEntity.turn;
        game.winner = gameEntity.winner;

        for (let i = 0; i < gameEntity.playerNicknames.length; i++) {
            const player = await this.playerRepository.findOneByNickname(gameEntity.playerNicknames[i]);
            if (player) game.players[i] = player;
        }
        return game;
    }

    private async fromObjectToEntity(game: Game): Promise<GameEntity> {
        const gameEntity = new this.gameModel(game);
        gameEntity.gameId = game.id;
        gameEntity.playerNicknames = game.players.map((player) => player.nickname);
        return gameEntity;
    }

    public async find(
        nickname?: string,
        date?: Date,
        orderBy: 'createdAt' | 'rounds' = 'createdAt'
    ): Promise<Game[]> {
        const filter: {
            playerNicknames?: RegExp,
            createdAt?: any;
        } = {};
        if (nickname) filter.playerNicknames = new RegExp(`^${nickname}$`, 'i');
        if (date) {
            const begin = new Date(date.getFullYear(), date.getMonth(), date.getDate());

            const end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

            filter.createdAt = { $gte: begin, $lt: end };
        }
        const gameEntities = await this.gameModel.find(filter).sort({ [orderBy]: orderBy === 'createdAt' ? 'desc' : 'asc' }).exec();
        return Promise.all(gameEntities.map(gameEntity => this.fromEntityToObject(gameEntity)));

    }
    public async save(game: Game): Promise<void> {
        const gameEntity = await this.fromObjectToEntity(game);
        await gameEntity.save();
    }

    public async findOne(gameId: string): Promise<Game | undefined> {
        const gameEntity = await this.gameModel.findOne({ gameId: gameId }).exec();
        if (!gameEntity) return undefined;
        return this.fromEntityToObject(gameEntity);
    }

    public async update(gameId: string, gameData: Partial<Game>): Promise<Game> {
        const gameDataClone = JSON.parse(JSON.stringify(gameData));
        const existingGame = await this.gameModel
            .findOneAndUpdate({ gameId: gameId }, { $set: gameDataClone }, { new: true })
            .exec();
        if (!existingGame) throw new Error(`Game ${gameId} not found`);

        return this.fromEntityToObject(existingGame);
    }
}