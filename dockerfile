FROM node:16.20.0

COPY package.json .

RUN npm install

EXPOSE 5000

COPY . .

RUN npm run build

CMD [ "node" , "build/src/index.js" ]