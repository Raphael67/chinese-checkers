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
        const game = await this.gameService.findOne(req.params.gameId);
        if (!game) throw new NotFoundException('Game does not exist');
        req.game = game;
        return true;
    }
}