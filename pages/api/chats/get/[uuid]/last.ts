import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../util/db";
// import { ObjectId } from "mongodb";

export default async function handler(req:NextApiRequest,res:NextApiResponse) {

  if(req.method === 'GET'){
    const parentId = req.query.uuid as string
    const pipeline = [
      {
        $match: { parentId } // parentId에 해당하는 문서 선택
      },
      {
        $project: {
          lastChat: { $arrayElemAt: ['$chat', -1] } // chat 배열의 마지막 요소 선택
        }
      }
    ];
    const db = (await connectDB).db('gloomychat')
    const result = await db.collection('chats').aggregate(pipeline).toArray();

    res.status(200).json(result[0])
  } else {
    res.status(500).json('code1')
  }
}
