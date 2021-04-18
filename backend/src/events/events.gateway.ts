import { Inject, Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CoordsDto } from '../board/dto/coords.dto';
import { IGameEvents } from '../game/game-events.interface';
import { Game } from '../game/game.entity';
import { GAME_SERVICE_EVENT_TOKEN } from '../game/game.module';
import { GameService } from '../game/game.service';
import { ConnectionRepository } from './connection.repository';
import { JoinGameDto } from './dto/join-game.dto';

export enum Events {
    JOIN_GAME = 'JOIN_GAME', // {gameId: string, nickname?: string}
    NEW_PLAYER = 'PLAYERS', // [{nickname: string, online: boolean}]
    GAME_STATE = 'GAME_STATE', // {status: GameStatus, turn: number, current_player: number, longest_streak: number}
    MOVE = 'MOVE', // Coords[]
    ERROR = 'ERROR', // message
}

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger: Logger = new Logger(EventsGateway.name);
    @Inject(GameService)
    private readonly gameService: GameService;

    @Inject(GAME_SERVICE_EVENT_TOKEN)
    private readonly eventEmitter: IGameEvents;

    @Inject(ConnectionRepository)
    private readonly connectionRepository: ConnectionRepository;

    public afterInit(server: Server): void {
        this.logger.debug('Websocket server initialized');
        this.eventEmitter.on('GAME_STATE', (game: Game) => {
            this.server.to(game.id).emit('GAME_STATE', {
                ...game,
            });
        });
    }

    public handleConnection(
        @ConnectedSocket() client: Socket, ...args: any[]
    ): void {
        this.logger.debug('Websocket connected');
    }

    public async handleDisconnect(
        @ConnectedSocket() client: Socket
    ): Promise<void> {
        this.logger.debug('Websocket disconnected');
        const connection = this.connectionRepository.findBySocketId(client.id);
        if (!connection) return;
        const game = await this.gameService.loadGame(connection.gameId);
        this.gameService.disconnectPlayer(game, connection.nickname);
        this.connectionRepository.removeConnection(connection.socketId);
    }

    @SubscribeMessage(Events.JOIN_GAME)
    public async handleJoinGame(
        @ConnectedSocket() client: Socket,
        @MessageBody() joinGameDto: JoinGameDto
    ): Promise<void> {
        let game: Game;
        try {
            game = await this.gameService.loadGame(joinGameDto.gameId);
            if (joinGameDto.nickname) {
                this.gameService.joinGame(game, joinGameDto.nickname);
                const connection = this.connectionRepository.findByPlayer(joinGameDto.gameId, joinGameDto.nickname);
                const socket = this.server.clients().connected[connection.socketId];
                socket.disconnect(true);
                this.connectionRepository.removeConnection(connection.socketId);
                this.connectionRepository.addConnection(client.id, joinGameDto.gameId, joinGameDto.gameId);
            }
            client.join(game.id);
        } catch (err) {
            client.emit('err', { message: err.message });
            client.disconnect();
        }
    }

    @SubscribeMessage(Events.MOVE)
    public handleMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() move: CoordsDto[]
    ): void {
        this.logger.debug(move);
    }

    @WebSocketServer()
    private readonly server: Server;

}
