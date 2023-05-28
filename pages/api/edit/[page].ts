// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from '@/util/db'
import {ObjectId} from 'mongodb'
type Data = {
  code: string | {title:string,content:string}
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  if(req.method === 'POST'){
    if(req.body.title !== '' || req.body.content !== '' || req.query.page !== ''){
      console.log(req.body.title)
      const id = new ObjectId(req.query.page as string)
      const newData = {title:req.body.title,content:req.body.content}
      const db = (await connectDB).db('youngBoard')
      const insert = await db.collection('post').updateOne({_id:id},{$set:newData})
      res.status(200).json({code:newData})
    } else {
      res.status(500).json({ code: 'FUCK' })
    }
    
  } else {
    res.status(500).json({ code: 'FUCK' })
  }
}
