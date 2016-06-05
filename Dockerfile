FROM node

EXPOSE 3000

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm install --production && \
	./node_modules/gulp/bin/gulp.js

CMD ["npm", "start"]
