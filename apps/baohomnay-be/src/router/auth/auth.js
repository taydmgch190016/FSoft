import express from 'express';
import {
  checkToken,
  createUser,
} from '../../controllers/account/account.controller';
import { login } from '../../controllers/auth/auth.controller';
import { authorization, verifyToken } from '../../middlewares/auth';
import "../../service/passport.service"
import { googleAuth , googleAuthCallback } from '../../service/passport.service';


const router = express.Router();
// auth routes
router.post('/api/auth/login', login);
router.post('/api/register', createUser);
router.get('/api/getaccessToken', verifyToken, checkToken);

router.get('/api/auth/google' , googleAuth);
router.get('/api/auth/google/callback', googleAuthCallback);


export default router;
