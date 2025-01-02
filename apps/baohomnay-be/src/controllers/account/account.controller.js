import { findOneAccount } from '../../service/account.service';
import account from '../../models/account.model';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import { transporter } from '../../service/nodemailer.service';

export const createUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existAccount = await findOneAccount({ email });

    if (existAccount) {
      return res.status(400).json({
        message: 'Account existed',
      });
    }

    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    req.body.password = hash;

    const userAccount = new account({
      ...req.body,
      role: 'guest',
    });

    await userAccount.save();

    return res.json({
      message: 'Create Account successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const listAccount = async (req, res, next) => {
  try {
    const accounts = await account.find().populate('categoryId');
    return res.status(200).json({ accounts });
  } catch (err) {
    next(err);
  }
};

export const checkToken = (req, res, next) => {
  res.status(200).json({ message: 'token is valid' });
};

export const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = req.body;

    delete user._id;
    await account.updateOne({ _id: userId }, user);

    return res.json({
      message: 'Update Account successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserDetails = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = req.body;
    console.log(user)
    if (!bcrypt.compareSync(user.password, user.passwordToken)) {
      return res.status(401).json({
        message: 'Password not Correct'
      })
    }

    delete user._id;
    await account.updateOne(
      { _id: userId },
      {
        fullname: user.fullname,
        dob: user.dob,
        address: user.address,
        phone: user.phone,
      }
    );
    

    return res.json({
      message: 'Update Account successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const removeAccount = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await account.deleteOne({ _id: userId });
    return res.json({
      message: 'Delete Account successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const findAccount = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const result = await account
      .findOne({ _id: userId })
      .populate('categoryId');

    return res.json({
      Result: result,
      message: 'Account successfully found',
    });
  } catch (error) {
    next(error);
  }
};

export const findProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const resultSearch = await account
      .findOne({ _id: userId })
      .populate('categoryId');
    const { role, ...result } = resultSearch._doc;

    return res.json({
      Result: result,
      message: 'Account successfully found',
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await account.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Account not found' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '600s',
    });

    user.passwordResetToken = token;
    user.passwordResetExpires = Date.now() + 600000;
    await user.save();

    const resetUrl = `${process.env.addFE}/auth/reset-password/${token}`;
    const mailOptions = {
      from: {
        name: 'BaoHomNayCorps',
        address: '<no-reply@gmail.com>',
      },
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `,
    };
    await transporter.sendMail(mailOptions);
    return res.json({ message: 'Password reset email sent' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const token = req.params.token;

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await account.findOne({
      _id: decodedToken.id,
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(401)
        .json({ error: 'Invalid or expired password reset token' });
    }

    const saltRounds = 10;
    const password = req.body.password;
    const hash = bcrypt.hashSync(password, saltRounds);
    req.body.password = hash;
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const mailOptions = {
      from: {
        name: 'BaoHomNayCorps',
        address: '<no-reply@gmail.com>',
      },
      to: user.email,
      subject: 'Password Reset Confirmation',
      html: `
      <p>Your password has been successfully reset. If you did not initiate this request, please contact us immediately.</p>
    `,
    };
    await transporter.sendMail(mailOptions);
    return res.json({ message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};
