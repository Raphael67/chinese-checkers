import { Inject, NotFoundException } from '@nestjs/common';
import { PlayerService } from '../player/player.service';
import { GameCacheRepository } from './game-cache.repository';
import { GameMongooseRepository } from './game-mongoose.repository';
import { IGameRepository } from './game-repository.interface';
import { Game, GameStatus } from './game.class';

export class GameRepository implements IGameRepository {
    public constructor(
        @Inject(GameMongooseRepository)
        private readonly gameMongooseRepository: GameMongooseRepository,
        @Inject(GameCacheRepository)
        private readonly gameCacheRepository: GameCacheRepository,
        @Inject(PlayerService)
        private readonly playerService: PlayerService,
    ) { }


    public async find(): Promise<Game[]> {
        return this.gameMongooseRepository.find();
    }

    public async save(game: Game): Promise<void> {
        await this.gameCacheRepository.save(game);
        if (game.status !== GameStatus.CREATED) {
            await this.gameMongooseRepository.save(game);
        }
    }

    public async findOne(gameId: string): Promise<Game | undefined> {
        let game = await this.gameCacheRepository.findOne(gameId);
        if (!game) {
            game = await this.gameMongooseRepository.findOne(gameId);
            if (!game) throw new NotFoundException(`No game found with id: ${gameId}`);
            if (game.status !== GameStatus.FINISHED) {
                for (let i = 0; i < 6; i++) {
                    if (!game.players[i]) game.players[i] = this.playerService.generateBot();
                }
                await this.save(game);
            }
        }
        return game;
    }

    public async update(gameId: string, gameData: Partial<Game>): Promise<Game> {
        return await this.gameMongooseRepository.update(gameId, gameData);
    }
}
