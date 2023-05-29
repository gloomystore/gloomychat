import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../util/db";
// import { ObjectId } from "mongodb";

export default async function handler(req:NextApiRequest,res:NextApiResponse) {

  if(req.method === 'GET'){
    const email = req.query.email as string
    const db = (await connectDB).db('gloomychat')
    const result = await db.collection('users').findOne({email})

    res.status(200).json(result?.image)
  } else {
    res.status(500).json('code1')
  }
}
