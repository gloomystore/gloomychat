import express, { Request, Response } from 'express';
import { connectToDatabase } from './db/mongo';
import cors from 'cors';
import routes from './routes';
import http from 'http';

const app = express();
const port = 8800;
const server = http.createServer(app);

app.use(cors({
  origin: ['http://local.gloomy-store.com:3020', 'https://local.gloomy-store.com:3020', 'http://local.gloomy-store.com', 'http://chat.gloomy-store.com', 'https://chat.gloomy-store.com', 'http://chat.gloomy-store.com:3020', 'http://localhost:3020', 'https://localhost:3020','http://192.168.0.144:3020','https://192.168.0.144:3020']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(routes);

app.get('/favicon.ico', (req, res) => res.status(204));
app.get('/', (req: Request, res: Response) => {
  console.log(req.query);
  res.send('Hello, users!');
});
app.get('/server', (req: Request, res: Response) => {
  console.log(req.query);
  res.send('Hello, users!!!!');
});


app.get('/api/users', async (req: Request, res: Response) => {
  // const dbCollection = db.collection('members');
  // const rows = await dbCollection.findOne();
  // return res.status(200).json(rows);
});


/**채팅 기능 */
const io = require("socket.io");
import addChatSocket from './util/chatSocketio';
addChatSocket(io,server,connectToDatabase)
// import addVideoSocket from './util/videoSocketio';
// addVideoSocket(io,server)

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});