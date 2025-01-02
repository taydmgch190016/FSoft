FROM node:18

WORKDIR /app

COPY . .

RUN npm install
RUN npm rebuild bcrypt

EXPOSE 80

CMD ["npx", "nx", "run-many", "--target=serve", "--all", "--maxParallel=100"]
