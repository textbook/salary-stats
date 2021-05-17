FROM node:fermium-alpine AS build

WORKDIR /home/node/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /home/node/app/dist /usr/share/nginx/html
