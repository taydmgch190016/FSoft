import jwt from 'jsonwebtoken';

import { RoleName } from '../models/account.model';

class JwtError extends Error {
  constructor(message) {
    super(message);
    this.status = 401;
  }
}

export function verifyToken(req, _res, next) {
  const bearerToken = req.headers.authorization;
  if (!bearerToken || !bearerToken.startsWith('Bearer')) {
    const error =  new JwtError('Jwt error');
    error.status = 401;
    throw error;
  }
  
  const userAccessToken = bearerToken.split('Bearer ')[1];
  const userData  = jwt.verify(userAccessToken, process.env.JWT_SECRET);
  req.user = userData.userAccount;

  return next();
}

export function authorization(allowRole) {
  return function(req, res, next) {
    const userData = req.user;
    if (!allowRole.includes(userData.role)) {
      const error =  new JwtError('Unauthorized');
      error.status = 401;
      throw error;
    }

    return next();
  }
}
