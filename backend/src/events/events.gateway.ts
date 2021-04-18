import { Inject, Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CoordsDto } from '../board/dto/coords.dto';
import { GameService } from '../game/game.service';

export enum Events {
    NEW_PLAYER = 'NEW_PLAYER', // nickname, position
    GAME_STATE = 'GAME_STATE', // status, turn, current_player, longest_streak
    MOVE = 'MOVE', // Coords[]
}

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger: Logger = new Logger(EventsGateway.name);
    @Inject(GameService)
    private readonly gameService: GameService;

    public afterInit(server: Server): void {
        this.logger.debug('Websocket server initialized');
    }

    public handleConnection(
        @ConnectedSocket() client: any, ...args: any[]
    ): void {
        this.logger.debug('Websocket connected');
    }

    public handleDisconnect(
        @ConnectedSocket() client: any
    ) {
        this.logger.debug('Websocket disconnected');
    }

    @SubscribeMessage(Events.MOVE)
    public handleMessage(
        @ConnectedSocket() client: any,
        @MessageBody() move: CoordsDto[]
    ): void {
        this.logger.debug(move);
    }

    @WebSocketServer()
    private readonly server: Server;

}
