FROM node:10.13.0-alpine

COPY fe-app /fe-app
COPY be-app /be-app

RUN cd /fe-app && npm install -g http-server && npm install && npm run build
RUN cd /be-app && npm install && npm run build

COPY docker/docker-entrypoint.sh /

CMD ["/docker-entrypoint.sh"]