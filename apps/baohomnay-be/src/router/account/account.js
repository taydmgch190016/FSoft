
import express from 'express';
import {
  updateUser,
  removeAccount,
  listAccount,
  findAccount,
  forgotPassword,
  resetPassword,
  findProfile,
  updateUserDetails
  
} from '../../controllers/account/account.controller';
import { authorization, verifyToken } from '../../middlewares/auth';
import { RoleName } from '../../models/account.model';
import { initialBill , createLog , findAllPayment } from '../../controllers/payOS/payos.controller';
const router = express.Router();
// auth routes
router.post('/api/user/forgot', forgotPassword);
router.post('/api/user/resetPass/:token', resetPassword);
router.get('/api/user/findProfile/:userId', verifyToken, findProfile);
router.put('/api/user/updateProfile/:userId',verifyToken, updateUserDetails);


router.get('/api/user/listAcc', verifyToken, authorization([RoleName.ADMIN]), listAccount);
router.get('/api/user/find/:userId', verifyToken,authorization([RoleName.ADMIN]), findAccount);
router.put('/api/user/update/:userId', verifyToken,authorization([RoleName.ADMIN]), updateUser);
router.delete('/api/user/delete/:userId', verifyToken,authorization([RoleName.ADMIN]), removeAccount);

router.get('/api/user/createBill/:accId' , verifyToken ,initialBill)
router.post('/api/createLogPayment/' ,verifyToken , createLog)
router.get('/api/findAllPayment' , verifyToken, authorization([RoleName.ADMIN]),findAllPayment)
export default router;
