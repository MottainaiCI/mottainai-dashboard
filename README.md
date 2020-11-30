# MottainaiCI Web Client

A web frontend for [MottainaiCI](https://github.com/MottainaiCI/mottainai-server)

## Deployment

A Dockerfile is included which will build and serve the app.

API requests will be proxied to the MottainaiCI server endpoint defined by the `API_URL` environment variable. e.g.

```bash
docker build -t mott-web .
docker run --rm -e API_URL=https://mottainai.example.com mott-web:latest
```

## Development

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
# API requests will be proxied to http://localhost:9090
# You can configure this and more in preact.config.js
npm run dev
```
