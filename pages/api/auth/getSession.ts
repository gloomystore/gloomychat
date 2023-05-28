import { getServerSession } from 'next-auth'
import { authOptions } from "../auth/[...nextauth]"
import { NextApiRequest, NextApiResponse } from 'next';
type Data = {
  session: string | {title:string,content:string}
}

export default async function getSession(
  req: NextApiRequest,
  res: NextApiResponse<Data>
){
  let session = await getServerSession(authOptions)
  if (session) {
    console.log(session)
    return res.status(200).json({session:JSON.stringify(session)})
  } else {
    console.log('fuck')
    return res.status(500).json({session:'false'})
  }
}