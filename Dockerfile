FROM node:12.18.3 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build

FROM nginx:1-alpine as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY docker/nginx.conf /etc/nginx/nginx.conf
