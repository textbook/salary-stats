ARG ALPINE_RELEASE
ARG NODE_RELEASE

FROM node:${NODE_RELEASE}-alpine${ALPINE_RELEASE} AS build

ENV CYPRESS_INSTALL_BINARY=0

WORKDIR /home/node/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:stable-alpine

LABEL maintainer="Jonathan Sharpe"

COPY --from=build /home/node/app/dist /usr/share/nginx/html
