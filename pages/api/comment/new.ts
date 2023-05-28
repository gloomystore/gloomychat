import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import {getServerSession} from 'next-auth'
import { connectDB } from "@/util/db";
import { ObjectId } from "mongodb";

export default async function handler(req:NextApiRequest,res:NextApiResponse) {
  const session = await getServerSession(req,res,authOptions)
  if(req.method === 'POST'){
    console.log(req.body)
    const data = {
      content: req.body.comment,
      parent: new ObjectId(req.body._id),
      author: session?.user?.email
    }
    const db = (await connectDB).db('youngBoard')
    const result = db.collection('comment').insertOne(data)
    res.status(200).json('code0')
  } else {
    res.status(500).json('code1')
  }
}
