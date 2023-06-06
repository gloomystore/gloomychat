import { connectToDatabase } from './mongo'; // 몽고DB 연결 관련 모듈로 가정합니다.
import { MongoClient, Db } from 'mongodb'; // 몽고DB 관련 타입들을 가져옵니다.

const user = async () => {
  const client: MongoClient = (await connectToDatabase()).client; // 몽고DB 클라이언트를 가져옵니다.
  const session = client.startSession(); // 세션 시작

  const db: Db = client.db(); // 클라이언트에서 DB 객체를 가져옵니다.

  const isExistSnsId = async (type: string, sns_id: string) => {
    try {
      const result = await db.collection('social_login').findOne({
        type,
        sns_id
      });

      if (result && result.id) {
        return result.id;
      } else {
        throw new Error();
      }

    } catch (error) {
      return false;
    }
  };

  const snsSignUp = async ({ email, nickname, sns_id, type }: any) => {
    session.startTransaction(); // 트랜잭션 시작

    try {
      if (!nickname) {
        nickname = email.split("@")[0];
      }
      if (email && nickname) {
        try {
          const user = await db.collection('user').insertOne({
            email,
            nickname
          }, { session });
          const social_login = await db.collection('social_login').insertOne({
            sns_id,
            type,
            user_id: user.insertedId
          }, { session });

          await session.commitTransaction(); // 트랜잭션 커밋

          return user.insertedId;
        } catch (error) {
          console.log(error);
          await session.abortTransaction(); // 트랜잭션 롤백
          return false;
        }
      }
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      session.endSession(); // 세션 종료
    }
  };

  return {
    snsSignUp,
    isExistSnsId
  };
};

export default user;