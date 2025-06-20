import express, { Express } from 'express';
import { Server } from '@noemdek/server';
import { databaseConnection } from '@noemdek/database';

class Application {
  public initialize(): void {
    databaseConnection();
    const app: Express = express();
    const server: Server = new Server(app);
    server.start();
  }
}

const application: Application = new Application();
application.initialize();
