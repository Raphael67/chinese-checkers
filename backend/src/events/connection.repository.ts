import { Injectable } from '@nestjs/common';

interface IConnection {
    socketId: string;
    gameId: string;
    nickname: string;
}

@Injectable()
export class ConnectionRepository {
    private connections: IConnection[] = [];

    public findBySocketId(socketId: string): IConnection | undefined {
        return this.connections.find(connection => connection.socketId === socketId);
    }

    public findByPlayer(gameId: string, nickname: string): IConnection | undefined {
        return this.connections.find(connection => connection.gameId === gameId && connection.nickname === nickname);
    }

    public find(socketId: string, gameId: string, nickname: string): IConnection | undefined {
        return this.connections.find(connection => {
            return connection.socketId === socketId && connection.gameId === gameId && connection.nickname === nickname;
        });
    }

    public removeConnection(socketId: string): void {
        const index = this.connections.findIndex(connection => connection.socketId === socketId);
        this.connections.splice(index);
    }

    public addConnection(socketId: string, gameId: string, nickname: string): void {
        if (this.findByPlayer(gameId, nickname)) return;
        this.connections.push({
            socketId,
            gameId,
            nickname,
        });
    }
}