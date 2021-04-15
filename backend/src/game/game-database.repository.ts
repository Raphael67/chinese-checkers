import { Inject } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Player } from '../player/player.class';
import { PlayerRepository } from '../player/player.repository';
import { GamePlayer } from './game-player.entity';
import { Game } from './game.class';
import { GameEntity } from './game.entity';
import { Move } from './move.entity';

export interface IFinishedGamesWithPlayers {
    game_id: string;
    rounds: number;
    longest_streak: number;
    created_at: Date;
    nickname: string;
    position: number;
}

@EntityRepository(GameEntity)
export class DatabaseGameRepository extends Repository<GameEntity> {
    public static fromEntityToGame(gameEntity: GameEntity): Game {
        const game = new Game();
        game.id = gameEntity.id;
        game.creator = gameEntity.creator?.id;
        game.longestStreak = gameEntity.longestStreak;
        game.players = (gameEntity.gamePlayers || []).map((gamePlayer): Player => {
            const player = new Player();
            player.isBot = false;
            player.loses = gamePlayer.player.lose;
            player.nickname = gamePlayer.player.nickname;
            player.rating = gamePlayer.player.rating;
            player.wins = gamePlayer.player.win;
            return player;
        });
        return game;
    }

    public async saveFinished(game: Game): Promise<void> {
        const playerEntities = [];
        for (let i = 0; i < 6; i++) {
            const player = game.players[i];
            if (player.isBot) continue;
            const playerEntity = await this.playerRepository.findOne({ nickname: player.nickname });
            if (game.winner === i) {
                playerEntity.win++;
            } else {
                playerEntity.lose--;
            }
            playerEntities[i] = await this.playerRepository.save(playerEntity);
        }
        const gameEntity = new GameEntity();
        gameEntity.creator = playerEntities[game.creator];
        gameEntity.longestStreak = game.longestStreak;
        gameEntity.rounds = game.turn;
        gameEntity.status = game.status;
        gameEntity.winner = playerEntities[game.winner];
        gameEntity.gamePlayers = playerEntities.map((playerEntity, index) => {
            const gamePlayer = new GamePlayer();
            gamePlayer.game = gameEntity;
            gamePlayer.player = playerEntity;
            gamePlayer.position = index;
            return gamePlayer;
        });
        gameEntity.moves = game.moves.map((move, index) => {
            const moveEntity = new Move();
            moveEntity.game = gameEntity;
            moveEntity.moveIndex = index;
            moveEntity.path = move;
            return moveEntity;
        });
        await this.save(gameEntity);
    }

    @Inject(PlayerRepository)
    private readonly playerRepository: PlayerRepository;
}