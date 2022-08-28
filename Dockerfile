FROM node:18.6.0-alpine

EXPOSE 3000
ENV HOST 0.0.0.0
ENV PORT 3000

WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm install --omit=dev

CMD ["npm", "start"]
