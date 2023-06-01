import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../util/db";
// import { ObjectId } from "mongodb";

export default async function handler(req:NextApiRequest,res:NextApiResponse) {
  if(req.method === 'POST'){
    const data = req.body;
    const db = (await connectDB).db('gloomychat')
    const result = await db.collection('chats').insertOne(data);
    res.status(200).json(result)
  } else {
    res.status(500).json('code1')
  }
}
