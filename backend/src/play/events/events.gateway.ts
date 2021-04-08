import { Logger } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

enum GatewayEvent {
    CONNECT = 'CONNECT',
    MOVE = 'MOVE',
}

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private logger: Logger = new Logger(EventsGateway.name);

    @SubscribeMessage('join')
    handleMessage(client: Socket, payload: any): void {
        this.logger.log(payload);
        this.server.emit('msgToClient', payload);
        client.join(payload.game);
    }

    afterInit(server: Server) {
        this.logger.log('Init');
    }

    handleDisconnect(client: Socket) {
        console.log(client.id);
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
    }
}