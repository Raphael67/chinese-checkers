import { Inject, Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Coords } from '../board/board';
import { BoardService } from '../board/board.service';
import { CoordsDto } from '../board/dto/coords.dto';
import { IGameEvents } from '../game/game-events.interface';
import { Game } from '../game/game.class';
import { GAME_SERVICE_EVENT_TOKEN } from '../game/game.module';
import { GameService } from '../game/game.service';
import { ConnectionRepository } from './connection.repository';
import { GameStateDto } from './dto/game-state.dto';
import { JoinGameDto } from './dto/join-game.dto';

export enum Events {
    JOIN_GAME = 'JOIN_GAME', // {gameId: string, nickname?: string}
    NEW_PLAYER = 'PLAYERS', // [{nickname: string, online: boolean}]
    GAME_STATE = 'GAME_STATE', // {status: GameStatus, turn: number, current_player: number, longest_streak: number}
    MOVE = 'MOVE', // Coords[]
}

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit, OnGatewayDisconnect {
    private readonly logger: Logger = new Logger(EventsGateway.name);

    @Inject(GameService)
    private readonly gameService: GameService;

    @Inject(BoardService)
    private readonly boardService: BoardService;

    @Inject(GAME_SERVICE_EVENT_TOKEN)
    private readonly eventEmitter: IGameEvents;

    @Inject(ConnectionRepository)
    private readonly connectionRepository: ConnectionRepository;

    public afterInit(server: Server): void {
        this.logger.debug('Websocket server initialized');
        this.eventEmitter.on('GAME_STATE', (game: Game) => {
            this.server.to(game.id).emit('GAME_STATE', GameStateDto.from(game));
        });
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
            client.emit('ERROR', { message: err.message });
            this.logger.warn(err);
            client.disconnect();
        }
    }

    @SubscribeMessage(Events.MOVE)
    public async handleMove(
        @ConnectedSocket() client: Socket,
        @MessageBody() move: Coords[],
    ): Promise<void> {
        const connection = this.connectionRepository.findBySocketId(client.id);
        if (!connection) return this.logger.warn('Player tried to move on unknown game');
        const game = await this.gameService.loadGame(connection.gameId);
        try {
            this.boardService.isValidMove(game, move);
        } catch (err) {
            client.emit('ERROR', { message: err.message });
            return;
        }
        await this.gameService.playMove(game, move);
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
