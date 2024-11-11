FROM node:18

WORKDIR /usr/src/app

COPY package.json .
COPY tsconfig.json .
COPY yarn.lock .
COPY .env .
COPY src/ ./src

RUN yarn 
RUN yarn build

EXPOSE 8008/tcp

ENTRYPOINT [ "yarn", "start" ]