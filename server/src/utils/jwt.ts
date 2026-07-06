import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { Role } from '@furnistore/shared';

export interface TokenPayload {
  userId: string;
  email: string;
  role: Role;
}

const accessOptions: SignOptions = {
  expiresIn: env.jwt.accessExpiry as SignOptions['expiresIn'],
};

const refreshOptions: SignOptions = {
  expiresIn: env.jwt.refreshExpiry as SignOptions['expiresIn'],
};

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.jwt.accessSecret, accessOptions);
}

export function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.jwt.refreshSecret, refreshOptions);
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.jwt.accessSecret) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, env.jwt.refreshSecret) as TokenPayload;
}