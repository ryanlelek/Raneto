FROM node:20.15.0-alpine3.20

EXPOSE 3000
ENV HOST 0.0.0.0
ENV PORT 3000

WORKDIR /opt/raneto
COPY . /opt/raneto

RUN npm install --omit=dev

CMD ["npm", "start"]
