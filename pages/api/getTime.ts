// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  function getTime(){
    const date = new Date(60 * 60 * 9 * 1000);
    return date.toString()
  }
  if(req.method === 'POST'){
    res.status(200).json({ name: getTime()})
  } else {
    res.status(200).json({ name: 'FUCK' })
  }
}
