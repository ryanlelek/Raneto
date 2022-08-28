FROM node:18.8.0-alpine3.16

EXPOSE 3000
ENV HOST 0.0.0.0
ENV PORT 3000

WORKDIR /opt/raneto
COPY . /opt/raneto

RUN npm install --omit=dev

CMD ["npm", "start"]
