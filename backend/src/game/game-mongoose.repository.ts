import { Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import PlayerRepository from '../player/player-mogoose.repository';
import { IGameRepository } from './game-repository.interface';
import { Game } from './game.class';
import { GameEntity } from './game.entity';

export default class GameRepository implements IGameRepository {
    private async fromEntityToObject(gameEntity: GameEntity): Promise<Game> {
        const game = new Game();
        game.createdAt = gameEntity.createdAt;
        game.creator = gameEntity.creator;
        game.longestStreak = gameEntity.longestStreak;
        game.moves = gameEntity.moves;
        game.status = gameEntity.status;
        game.turn = gameEntity.turn;
        game.winner = gameEntity.winner;

        for (let i = 0; i < gameEntity.playerNicknames.length; i++) {
            game.players[i] = await this.playerRepository.findOneByNickname(gameEntity.playerNicknames[i]);
        }
        return game;
    }

    public async find(): Promise<Game[]> {
        const gameEntities = await this.gameModel.find().exec();
        return Promise.all(gameEntities.map(gameEntity => this.fromEntityToObject(gameEntity)));

    }
    public async save(game: Game): Promise<void> {
        const gameEntity = new this.gameModel(game);
        await gameEntity.save();
    }

    public async findOne(gameId: string): Promise<Game | undefined> {
        const gameEntity = await this.gameModel.findOne({ _id: gameId }).exec();
        if (!gameEntity) return undefined;
        return this.fromEntityToObject(gameEntity);
    }

    public async update(gameId: string, gameData: Partial<Game>): Promise<Game> {
        const existingGame = await this.gameModel
            .findOneAndUpdate({ _id: gameId }, { $set: gameData }, { new: true })
            .exec();
        if (!existingGame) throw new Error(`Game ${gameId} not found`);

        return this.fromEntityToObject(existingGame);
    }

    @InjectModel(GameEntity.name)
    private readonly gameModel!: Model<GameEntity>;

    @Inject(PlayerRepository)
    private readonly playerRepository!: PlayerRepository;

}