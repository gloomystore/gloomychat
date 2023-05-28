import { MongoClient ,ConnectOptions} from 'mongodb'
const url = `mongodb://${process.env.NEXT_PUBLIC_DB_USER}:${encodeURIComponent(process.env.NEXT_PUBLIC_DB_PASSWORD as string)}@${process.env.NEXT_PUBLIC_DB_HOST}:${process.env.NEXT_PUBLIC_DB_PORT}`
const options = { useNewUrlParser: true } as ConnectOptions
let connectDB: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  if (!(global as any)._mongo) {
    (global as any)._mongo = new MongoClient(url, options).connect()
  }
  connectDB = (global as any)._mongo
} else {
  connectDB = new MongoClient(url, options).connect()
}
export { connectDB }