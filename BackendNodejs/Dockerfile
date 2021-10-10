FROM node:16-alpine3.11

WORKDIR /backendnodejs

COPY package.json .

RUN npm install

COPY . .

EXPOSE 4000

ENTRYPOINT [ "npm" ]

CMD [ "run", "start" ]



