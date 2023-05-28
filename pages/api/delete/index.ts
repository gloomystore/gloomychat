// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from '@/util/db'
import {ObjectId} from 'mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
type Data = {
  code: string | {title:string,content:string}
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let session = await getServerSession(req,res,authOptions);
  if(req.method === 'POST'){
    if(req.body._id !== ''){
      console.log(req.body._id)
      const id = new ObjectId(req.body._id as string)
      const db = (await connectDB).db('youngBoard')

      const getData = await db.collection('post').findOne({_id:id})
      if(session && session?.user?.email === getData?.author){
        const insert = await db.collection('post').deleteOne({_id:id})
        res.status(200).json({code:insert.deletedCount.toString()})
      } else {
        res.status(200).json({ code: 'FUCK' })
      }

    } else {
      res.status(200).json({ code: 'FUCK' })
    }
    
  } else {
    res.status(500).json({ code: 'FUCK' })
  }
}
