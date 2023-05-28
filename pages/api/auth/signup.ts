import { connectDB } from "@/util/db"
import { NextApiRequest, NextApiResponse } from "next"
import bcrypt from 'bcrypt'

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method === 'POST'){
    const hash = await bcrypt.hash(req.body.password,10)
    console.log(req.body)
    console.log(hash)
    req.body.password = hash;

    const db = (await connectDB).db('youngBoard');
    const already = await db.collection('user_cred').findOne({email:req.body.email})
    if(already) return res.status(200).json('code1') // 이미 계정 존재
    await db.collection('user_cred').insertOne(req.body)
    res.status(200).json('code0')
  }
}