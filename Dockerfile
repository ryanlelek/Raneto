FROM node:22.19.0-alpine

ENV HOST 0.0.0.0
ENV PORT 3000
ENV NODE_ENV production

WORKDIR /opt/raneto
USER node

# Copy package.json and install to cache
COPY ./package.json .
RUN npm install --omit=dev

COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
