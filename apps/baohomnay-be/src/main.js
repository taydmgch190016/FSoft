import express from 'express';
import mongoose from 'mongoose';
import routerAuth from './router/auth/auth';
import routerAccount from './router/account/account';
import routerCategory from './router/article/category';
import routerArticle from './router/article/article';
import { handleError, handleNotFound } from './middlewares/handle-error';
import { Server} from 'socket.io'
import { createServer } from 'http';
import {Message} from './service/socket.service';
import cors from 'cors';

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      const allowedOrigins = [`${process.env.httpswwwFE || 'http://localhost:4200'}` , `${process.env.httpsFE || 'http://localhost:4200'}`];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  },
  path: '/api/socket/', 
});

async function main() {
  await mongoose.connect(process.env.MONGODB)
   .then(() => console.log('[ ready ] Connected to MongoDB'));

  app.use(
    cors({
      // origin: 'http://localhost:4200',
      origin: function (origin, callback) {
        const allowedOrigins = [`${process.env.httpswwwFE || 'http://localhost:4200'}` , `${process.env.httpsFE || 'http://localhost:4200'}`];
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      
    })
  );

  app.use(express.json());
  app.use(routerArticle);
  app.use(routerAuth);
  app.use(routerAccount)
  app.use(routerCategory);
  app.use(routerArticle)
  app.use(handleError);
  app.use(handleNotFound);

  io.on('connection', (socket) => {
    console.log(`[ socket.io ] Client connected: ${socket.id}`);
    Message(socket, io)

  
    socket.on('disconnect', () => {
      console.log(`[ socket.io ] Client disconnected: ${socket.id}`);
    });
  });
}

main().catch((err) => console.log(err));

server.listen(port, () => {
  console.log(`[ ready ] On port ${port}`);
});
