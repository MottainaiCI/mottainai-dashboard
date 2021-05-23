FROM node:14-alpine as build
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
COPY src/ ./src
COPY jsconfig.json \
  preact.config.js tailwind.config.js \
  .eslintrc.json .babelrc \
  ./
RUN npm run build

# production environment
FROM node:14-alpine
WORKDIR /usr/src/app
COPY --from=build /app/build ./build
COPY package-proxy.json package.json
RUN npm i --silent
COPY proxy.js .
CMD ["node", "proxy.js"]
