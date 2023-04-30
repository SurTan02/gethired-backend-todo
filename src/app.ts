import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import {init, migration} from './db'
import { routes } from './routes/routes';


dotenv.config();

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});
app.use(express.json());
app.use(routes);

const run = async () => {
    init(); // 👈 running migration before server
    await migration(); // 👈 running migration before server
};
run()
module.exports = app
