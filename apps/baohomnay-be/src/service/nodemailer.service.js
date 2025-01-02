import nodemailer from "nodemailer"; 
import * as _ from 'lodash';
export const transporter = nodemailer.createTransport({
    host: process.env.NAMEGMAIL,
    port: 465,
    secure: true, 
    auth: {
      user: process.env.authUSER,
      pass: process.env.authPASS,
    },
  });