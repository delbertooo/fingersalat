FROM node:12.18.3-alpine3.12

RUN apk add --no-cache git
RUN npm i -g @vue/cli@4.5.4
