import jwt from 'jsonwebtoken';

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, "PASSWORD");
    return decoded;
  } catch (error:any) {
    if (error.name === 'TokenExpiredError') {
      // TokenExpiredError 처리
    }
    if (error.name === 'JsonWebTokenError') {
      console.log(error);
    }
    if (error.name === 'NotBeforeError') {
      console.log(error);
    }
    console.log(error);
    return false;
  }
};

const makeAccessToken = (id) => {
  try {
    return jwt.sign(
      {
        id
      },
      "PASSWORD",
      {
        expiresIn: '2h'
      }
    );
  } catch (error:any) {
    // 처리
  }
};

const makeRefreshToken = (id) => {
  try {
    return jwt.sign(
      {
        id
      },
      "PASSWORD",
      {
        expiresIn: '14d'
      }
    );
  } catch (error:any) {
    // 로그 남기기
    return "error";
  }
};

export { verifyToken, makeAccessToken, makeRefreshToken };