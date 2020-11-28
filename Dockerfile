FROM node:14-alpine as build
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
COPY . ./
RUN npm run build

# production environment
FROM node:14-alpine
WORKDIR /usr/src/app
RUN npm i express http-proxy-middleware
COPY --from=build /app/build ./build
COPY proxy.js .
EXPOSE 3000
CMD ["node", "proxy.js"]
