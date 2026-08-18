import * as http from 'node:http';
import { ApiRouter } from './ApiRouter.js';

export interface HttpServerOptions {
  port?: number;
  workspaceRoot?: string;
}

export class HttpServer {
  private readonly port: number;
  private readonly apiRouter: ApiRouter;
  private server?: http.Server;

  constructor(options: HttpServerOptions = {}) {
    this.port = options.port || 4000;
    this.apiRouter = new ApiRouter(options.workspaceRoot || process.cwd());
  }

  public start(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.server = http.createServer((req, res) => {
        const url = req.url || '/';
        const response = this.apiRouter.handleRequest(url);

        res.writeHead(response.status, {
          'Content-Type': response.contentType,
          'Access-Control-Allow-Origin': '*',
        });
        res.end(response.body);
      });

      this.server.listen(this.port, () => {
        const serverUrl = `http://localhost:${this.port}`;
        resolve(serverUrl);
      });

      this.server.on('error', (err) => {
        reject(err);
      });
    });
  }

  public stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => resolve());
      } else {
        resolve();
      }
    });
  }

  public getRouter(): ApiRouter {
    return this.apiRouter;
  }
}
