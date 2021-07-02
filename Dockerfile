FROM node

EXPOSE 3000
ENV HOST 0.0.0.0
ENV PORT 3000

WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm install --production
RUN ./node_modules/gulp/bin/gulp.js

CMD ["npm", "start"]
