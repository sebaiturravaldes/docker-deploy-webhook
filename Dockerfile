# Image
FROM node:8-alpine
RUN apk update
RUN apk add docker

# Set Workdir
WORKDIR /app
COPY index.js .
COPY config.json .
COPY package.json .

RUN npm install

EXPOSE 80

CMD [ "npm", "start" ]
