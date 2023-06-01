import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../util/db";
// import { ObjectId } from "mongodb";

export default async function handler(req:NextApiRequest,res:NextApiResponse) {
  if(req.method === 'POST'){
    const data = req.body;
    const db = (await connectDB).db('gloomychat')
    // 시간 값의 소수점 이하 값을 제거하여 처리
    data.time = data.time.split('.')[1] ? data.time.split('.')[0] : data.time
    const result = await db.collection('chatrooms').insertOne(data);
    res.status(200).json(result)
  } else {
    res.status(500).json('code1')
  }
}
