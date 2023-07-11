import net from 'net';
import { Session } from './session';
import { Url } from './common';
import { Packet } from './packet';
import { CommandType, getCommand } from './command';

export class Server {
    private port: number;
    private inner: net.Server;
    private sessions: Map<Url, Session>;
    private current_session?: Session;

    public constructor(port: number) {
        this.port = port;
        this.inner = net.createServer((sock) => this.readPackets(sock));
        this.sessions = new Map();
    }

    public listen(): void {
        this.inner.listen(this.port, () => {
            console.log(`Listening on ${this.port}`);
        });
    }

    // TODO: Support multiple connections
    private readPackets(sock: net.Socket): void {
        let length = -1;
        let header = Buffer.from([]);
        let message = Buffer.from([]);

        const parse = (data: Buffer) => {
            if (length === -1) {
                header = Buffer.concat([header, data.subarray(0, 4 - header.length)]);
                if (header.length == 4) {
                    length = header.readUInt32BE();
                    data = data.subarray(4);
                }
            }
            if (message.length < length) {
                message = Buffer.concat([message, data.subarray(0, length - message.length)]);
                if (message.length == length) {
                    this.handlePacket(new Packet(message), sock);

                    data = data.subarray(length);
                    length = -1;
                    header = Buffer.from([]);
                    message = Buffer.from([]);
                    if (data.length > 0) {
                        parse(data);
                    }
                }
            }
        };

        sock.on("data", parse);
    }

    private handlePacket(packet: Packet, sock: net.Socket): void {
        const command = getCommand(packet);

        switch (command.type) {
            case CommandType.use:
                if (this.sessions.has(command.url)) {
                    this.current_session = this.sessions.get(command.url);
                } else {
                    console.log(`Starting rendering for ${command.url}`)
                    this.current_session = new Session(command.url, 800, 600);
                    this.current_session.run();
                    this.sessions.set(command.url, this.current_session);
                }
                break;
            case CommandType.resolution:
                if (this.current_session.width != command.width || this.current_session.height != command.height) {
                    this.current_session.resize(command.width, command.height);
                }
                break;
            case CommandType.source:
                console.warn("unimplemented");
                break;
            case CommandType.render:
                let packet = new Packet(this.current_session.frame);
                packet.send(sock);
                break;
            case CommandType.unknown:
                console.warn("unknown command");
                break;
            default:
                console.error(`Invalid command: ${command}`);
        }
    }
}
