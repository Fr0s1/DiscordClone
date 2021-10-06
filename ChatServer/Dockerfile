FROM node:16-alpine3.11

WORKDIR /chatserver

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

ENTRYPOINT [ "npm" ]

CMD [ "run", "start" ]



