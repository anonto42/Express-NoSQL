import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import { StringValue } from 'ms';

const createToken = (
  payload: string | object | Buffer,
  secret: Secret,
  expireTime: StringValue
): string => {

  const options: SignOptions = {
    expiresIn: expireTime,
    algorithm: "HS512"
  };

  return jwt.sign(payload, secret, options);
};

const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelper = { createToken, verifyToken };