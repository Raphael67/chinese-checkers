import { CanActivate, ExecutionContext, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { Game } from './game.entity';
import { GameService } from './game.service';

export type RequestWithGame = Request & { game: Game; };

@Injectable()
export class GameGuard implements CanActivate {
    @Inject(GameService)
    private readonly gameService: GameService;

    public async canActivate(
        context: ExecutionContext
    ): Promise<boolean> {
        const req = context.switchToHttp().getRequest<RequestWithGame>();
        let game = this.gameService.getLoadedGame(req.params.gameId);
        if (!game) {
            game = await this.gameService.findOne(req.params.gameId);
        }
        if (!game) throw new NotFoundException('Game does not exist');
        if (!game.gamePlayers) game.gamePlayers = [];
        req.game = game;
        return true;
    }
}