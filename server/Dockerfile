FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

EXPOSE 3000
CMD [ "yarn", "nodemon", "src/server.js" ]