import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../util/db";
// import { ObjectId } from "mongodb";

export default async function handler(req:NextApiRequest,res:NextApiResponse) {

  if(req.method === 'GET'){
    const uuid = req.query.uuid as string
    const db = (await connectDB).db('gloomychat')
    const result = await db.collection('chatrooms').findOne({uuid});
    // console.log(result)
    res.status(200).json(result)
  } else {
    res.status(500).json('code1')
  }
}
