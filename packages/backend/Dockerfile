FROM docker.io/library/node:24-alpine 

ENV TINI_VERSION=v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]

WORKDIR /app
COPY ./dist/index.mjs /app
EXPOSE 8080

CMD ["node", "index.mjs"]
