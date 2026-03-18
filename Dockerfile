FROM node:24.14.0-alpine

ENV HOST=0.0.0.0
ENV PORT=8080
ENV NODE_ENV=production

WORKDIR /opt/raneto
RUN mkdir -p /opt/raneto/content && chown -R node:node /opt/raneto

# User node (Group node 1000)
USER 1000

# Copy package.json and install to cache
COPY --chown=1000:1000 ./package.json .
RUN npm install --omit=dev

COPY --chown=1000:1000 . .

EXPOSE 8080
CMD ["node", "server.js"]
