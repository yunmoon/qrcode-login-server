import { createServer, Server } from 'http';
import express from 'express';
import socketIo from 'socket.io';
import socketAuth from "./middlewares/socketAuth";

export class AppServer {
    public static readonly PORT: number = 8087
    private app: express.Application;
    private server: Server;
    private io: socketIo.Server;
    private port: string | number;
    private socketCallback: (socket: any) => void;

    constructor (socketCallback: (socket: any) => void) {
        this.app = express();
        this.server = createServer(this.app);
        this.port = process.env.PORT || AppServer.PORT;
        this.io = socketIo(this.server);
        this.socketCallback = socketCallback
        this.listen();
    }

    private listen () {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });
        this.io.use(socketAuth);
        this.io.on('connect', (socket: any) => {
            console.log('Connected client on port %s.', this.port);
            this.socketCallback(socket);
            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }
    public getApp () :express.Application{
        return this.app;
    }
}
