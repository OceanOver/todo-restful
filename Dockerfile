FROM node:8.15.1-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN npm i

# RUN npm i --registry=https://registry.npm.taobao.org

COPY . /usr/src/app

RUN npm run asset_build

EXPOSE 7001

CMD npm run start
