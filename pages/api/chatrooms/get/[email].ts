import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../util/db";
// import { ObjectId } from "mongodb";

export default async function handler(req:NextApiRequest,res:NextApiResponse) {

  if(req.method === 'GET'){
    const email = req.query.email as string
    const pipeline = [
      {
        $match: {
          $or: [
            { host: email },
            { guest: email }
          ]
        }
      },
      {
        $sort: {
          time: -1
        }
      }
    ];
    const db = (await connectDB).db('gloomychat')
    const result = await db.collection('chatrooms').aggregate(pipeline).toArray();
    // console.log(result)
    res.status(200).json(result)
  } else {
    res.status(500).json('code1')
  }
}
