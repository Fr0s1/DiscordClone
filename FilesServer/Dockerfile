FROM node:16-alpine3.11

WORKDIR /filesserver

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8000

ENTRYPOINT [ "npm" ]

CMD [ "run", "start" ]
