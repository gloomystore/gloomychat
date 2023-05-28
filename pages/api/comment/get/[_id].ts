import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/util/db";
import { ObjectId } from "mongodb";

export default async function handler(req:NextApiRequest,res:NextApiResponse) {

  if(req.method === 'GET'){
    const parent = new ObjectId(req.query._id as string)
    const db = (await connectDB).db('youngBoard')
    const result = await db.collection('comment').find({parent}).toArray();
    console.log(result)
    res.status(200).json(result)
  } else {
    res.status(500).json('code1')
  }
}
