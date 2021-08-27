# MottainaiCI Web Client

[![Docker Repository on Quay](https://quay.io/repository/mottainai/dashboard/status "Docker Repository on Quay")](https://quay.io/repository/mottainai/dashboard)

A web frontend for [MottainaiCI](https://github.com/MottainaiCI/mottainai-server)

## Deployment

A Dockerfile is included which will build and serve the app.

API requests will be proxied to the MottainaiCI server endpoint defined by the `API_URL` environment variable. e.g.

```bash
$> docker build -t mott-web .
$> docker run --rm -e API_URL=https://mottainai.example.com mott-web:latest
```

## Development

```bash
# install dependencies
$> npm install

# serve with hot reload at localhost:30000
# API requests will be proxied to http://localhost:9090
# You can configure this and more in preact.config.js
# or through environment variables.
$> npm run dev
```

## Run Dashboard Locally

1. Build console application

```bash
$> npm run build
```

Of if you want to change the base path it's possible
only at build time.

```bash
$> APP_PREFIX=/mottainai-dashboard/ npm run build
```

2. Run Dashboard

```bash
$> API_URL="http://mottainai-server.mottainai.local:19090" node proxy.js
```

or if you have built the application with APP_PREFIX

```bash
$> export APP_PREFIX="/mottainai-dashboard/"
$> export API_URL="http://mottainai-server.mottainai.local:19090"
$> node proxy.js
```

### Environment Variables

| Env | Default | Description |
|-----|---------|-------------|
| PORT | 3000 | Binding port. |
| HOST | 0.0.0.0 | Binding address. |
| INSECURE | false | Accept self signed certificates from Mottainai Server |
| STATIC_DIR | $PWD/build | Path of the static files. |
| APP_PREFIX | / | Base path. |
| USE_SSL | false | Enable HTTPS (requires PRIVATE_KEYFILE and CERT_FILE) |
| PRIVATE_KEYFILE | "" | Define the path of private key. |
| CERT_FILE | "" | Define the path of the .crt file. |

