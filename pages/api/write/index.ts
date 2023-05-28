// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from '@/util/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
type Data = {
  code: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  let session = await getServerSession(req,res,authOptions);
  let data = req.body;
  console.log(session)
  if(session){
    req.body.author = session?.user?.email
    data = {...data,author:req.body.author}
  }

  if(req.method === 'POST'){
    if(req.body.title !== '' || req.body.content !== ''){
      const db = (await connectDB).db('youngBoard')
      const insert = db.collection('post').insertOne(data)
      res.status(200).redirect('/list')
    } else {
      res.status(500).json({ code: 'FUCK' })
    }
    
  } else {
    res.status(500).json({ code: 'FUCK' })
  }
}
