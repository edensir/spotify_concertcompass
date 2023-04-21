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
    console.log('/createuser: ', req.body);
    // o take access token from req.body;
    const accessToken = req.body.token;

    // o call spotifyService > me func;
    const meData = await me(accessToken);
    // o from me endpoint get name + email + images;
    const { display_name: name, email, images } = meData;
  
    // o call spotifyService > topArtists func;
    const topArtistsData = await topArtists(accessToken);
    const { items } = topArtistsData;
    const topArtistsList: Artists = items.map((item) => ({
      name: item.name,
      popularity: item.popularity,
    }))

    // o create new user in database;
    await upsertUser(email, topArtistsList, [], [], name, images[0].url, accessToken);

    // o create new jwt token -> return
    const token: string = jwt.sign({
      data: email,
    }, 'ssapmoCtrecnoC', { expiresIn: '1h' });
  
    return res.json({token});
});

// get list of top artists
app.get('/topartists', async (req, res) => {
  try {
    const jwtToken = req.headers.token as string;
    if (typeof jwtToken !== 'string') {
      return res.status(500).json({message: 'invalid token'});
    }

    const decoded: {data: string} = tokenVerify(jwtToken);
    const email = decoded.data;

    // get user from database -> get access token from retrieved user
    const user = await getUser(email);
    // console.log('user: ', user);

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
  console.log('\n\n\n\n\n\n\nDELETE CALLL\n\n\n\n\n\n\n');
  try {
    const jwtToken = req.headers.token as string;
    if (typeof jwtToken !== 'string') {
      return res.status(500).json({message: 'invalid token'});
    }

    const decoded: {data: string} = tokenVerify(jwtToken);
    const email = decoded.data;
    console.log('email: ', email)
    await upsertUser(email, [], [], []);
    return res.status(204);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// BACKEND BACKEND
// post create preferred artists
  //upsertUser savedlist
  // ticketmaster api call: get events + set going: false
  // store events in mongo [add 'events' in typoes + model] -> upsertUser(email, undefined, undefined..., events);
  // res.json({savedArtits, events})

// update set going: true | false
  // get eventName from req.body
  // get user -> find event in events array: update going to : opposite
  // upsertUser(email, undefined, undefined..., events);

// delete remove saved artists
  //get user email
  // upsertUser(email, undefined, undefined..., [], [])

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});