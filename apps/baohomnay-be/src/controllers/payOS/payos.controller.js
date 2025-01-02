import PayOSsdk from "@payos/node";
import { createBill } from "../../service/payment.service";
import accountModel from '../../models/account.model'
import paymentModel from "../../models/payment.model";
export const initialBill = async (req, res, next) => {
  try {
    const { accId } = req.params ;
    const result = await createBill(accId);
    return res.json({
      result 
    })

  } catch (err) {
    next(err);
  }
};

export const createLog = async ( req , res , next) => {
  try { 
    await paymentModel.create(req.body);
    await accountModel.updateOne({ _id: req.body.accountId }, {verify : true}  );
    return res.json({
      message : 'Create log successfully'
    })
  }
  catch (error){
    next(error)
  }
}

export const findAllPayment = async ( req , res , next) => {
  try { 
    const result = await paymentModel.find().populate('accountId');

    return res.json({
      result : result
    })
  }
  catch (error){
    next(error)
  }
}