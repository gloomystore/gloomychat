import express, { Request, Response } from 'express';
import { connectToDatabase } from './db/mongo';
import cors from 'cors';

(async () => {
  const app = express();
  const port = 8800;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  app.use(express.json()); // JSON 형식의 본문 파싱
  app.use(express.urlencoded({ extended: false })); // URL-encoded 형식의 본문 파싱

  let allowedOrigins = ['http://local.gloomy-store.com:3333', 'http://local.gloomy-store.com','http://chat.gloomy-store.com','http://chat.gloomy-store.com:3333'];
  app.use(cors({
    origin: allowedOrigins
  }));

  const { db } = await connectToDatabase();
  app.get('/favicon.ico', (req, res) => res.status(204));
  app.get('/api', (req:Request, res:Response) => {
    console.log(req.query);
    res.send('Hello, users!');
  });

  app.get('/api/users', async(req:Request, res:Response) => {
    const dbCollection = db.collection('members');
    const rows = await dbCollection.findOne();
    return res.status(200).json(rows);
  });
})();