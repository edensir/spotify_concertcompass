import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db';
import bodyParser from 'body-parser';
import cors from 'cors';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

connectDB()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});
 
app.post('/createuser', (req, res) => {
    let data = req.body;
    console.log(req.body)
    res.send('Data Received: ' + JSON.stringify(data));
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});