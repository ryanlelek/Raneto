FROM node

EXPOSE 3000

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm install --production && \
	npm run copylibs

CMD ["npm", "start"]
