import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db';
import bodyParser from 'body-parser';
import cors from 'cors';
import { me, topArtists } from './services/spotifyService';
import jwt from 'jsonwebtoken';
import { getUser, upsertUser } from './services/mongoService';
import { Artists } from './models/types';
import { tokenVerify } from './services/authService';

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

app.post('/createuser', async (req, res) => {

    const accessToken = req.body.token;

    const meData = await me(accessToken);

    const { display_name: name, email, images } = meData;
  
    const topArtistsData = await topArtists(accessToken);
    const { items } = topArtistsData;
    const topArtistsList: Artists = items.map((item) => ({
      name: item.name,
      popularity: item.popularity,
    }))

    await upsertUser(email, topArtistsList, [], [], name, images[0].url, accessToken);

    const token: string = jwt.sign({
      data: email,
    }, 'ssapmoCtrecnoC', { expiresIn: '1h' });
  
    return res.json({token});
});

app.get('/topartists', async (req, res) => {
  try {
    const jwtToken = req.headers.token as string;
    if (typeof jwtToken !== 'string') {
      return res.status(500).json({message: 'invalid token'});
    }

    const decoded: {data: string} = tokenVerify(jwtToken);
    const email = decoded.data;

    const user = await getUser(email);

    if (user === null) {
      return res.status(204).json({message: 'invalid user'});
    }

    const topArtistsData = await topArtists(user.accessToken);
    const { items } = topArtistsData;
    const topArtistsList: Artists = items.map((item) => ({
      name: item.name,
      popularity: item.popularity,
    }));

    await upsertUser(email, topArtistsList);

    return res.json(topArtistsList);
  } catch (error) {
    return res.status(500).json(error);
  }
});

app.delete('/topartists', async (req, res) => {
  try {
    const jwtToken = req.headers.token as string;
    if (typeof jwtToken !== 'string') {
      return res.status(500).json({message: 'invalid token'});
    }

    const decoded: {data: string} = tokenVerify(jwtToken);
    const email = decoded.data;
    await upsertUser(email, [], [], []);
    return res.status(204);
  } catch (error) {
    return res.status(500).json(error);
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});