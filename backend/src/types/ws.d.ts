declare module 'ws' {
  import { Server as HttpServer } from 'http';
  import { Socket } from 'net';
  
  export class WebSocketServer {
    constructor(options: { noServer: boolean });
    handleUpgrade(request: any, socket: Socket, head: Buffer, callback: (ws: WebSocket) => void): void;
    emit(event: string, ...args: any[]): void;
    on(event: string, listener: (...args: any[]) => void): void;
  }
  
  export class WebSocket {
    readyState: number;
    send(data: string): void;
    on(event: string, listener: (...args: any[]) => void): void;
    static readonly OPEN: number;
  }
}
