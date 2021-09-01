const path = require("path")
const fs = require('fs')
const http = require('http');
const https = require('https');
const Koa = require("koa")
const proxy = require("koa2-nginx")
const sendfile = require("koa-sendfile")
const Router = require("koa-router")
const koastatic = require("koa-static")
const helmet = require("koa-helmet")
const logger = require("koa-logger")
const mount  = require('koa-mount')

// config
const apiUrl = process.env.API_URL || "http://localhost:9090"
const port = process.env.PORT || 3000
const host = process.env.HOST || "0.0.0.0"
const insecure = process.env.INSECURE || false
const staticDir = process.env.STATIC_DIR || path.join(__dirname, "build/")
const appPrefix = process.env.APP_PREFIX || "/"
const useSSL = process.env.USE_SSL || "false"
const privateKeyFile = process.env.PRIVATE_KEYFILE || ""
const certFile = process.env.CERT_FILE || ""

process.on("SIGINT", () => {
  console.info("Exiting server")
  process.exit(0)
})

const app = new Koa()

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        // TODO: Move this options through a configuration file.
        scriptSrcAttr: ["'self'", "'unsafe-inline'", "fonts.gstatic.com", "fonts.googleapis.com*"],
        scriptSrcElem: ["'self'", "cdn.jsdelivr.net", "'unsafe-inline'"],
        defaultSrc: ["'self'", "cdn.jdsdelivr.net", "fonts.gstatic.com", "fonts.googleapis.com*", "'unsafe-inline'", "data:"],
        imageSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "fonts.gstatic.com", "fonts.googleapis.com", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        fontSrc: ["'self'", "fonts.gstatic.com", "fonts.googleapis.com", "'unsafe-inline'"],
        workerSrc: ["blob:"],
      },
    }
  })
)

app.use(logger())

app.use(
  proxy({
    [appPrefix+"api"]: {
      target: apiUrl,
      secure: !insecure,
      changeOrigin: true,
      pathRewrite: {
        ["^"+appPrefix+"api"]: "/api",
      },
    },
    [appPrefix+"public"]: {
      target: apiUrl,
      secure: !insecure,
      changeOrigin: true,
      pathRewrite: {
        ["^"+appPrefix+"public"]: "",
      },
    }
  })
)
console.log("Using prefix " + appPrefix + "\nUsing SSL " + useSSL);
const mRouter = new Router({
  prefix: appPrefix,
});


const handler = async function(ctx) {
  ctx.redirect(appPrefix);
  ctx.status = 301;
}

mRouter.get([
  "artefacts",
  "integrations",
  "plans",
  "pipelines",
  "nodes",
  "tasks",
  "tokens",
  "users",
], handler);


app.use(mRouter.routes());
app.use(mRouter.allowedMethods());

app.use( mount(appPrefix, koastatic(staticDir)) )


// Check if the certificates are availables
if (useSSL == "true") {

  if (!fs.statSync(privateKeyFile).isFile())
    throw new Error(`Invalid private key file ${privateKeyFile}`)
  if (!fs.statSync(certFile).isFile())
    throw new Error(`Invalid certificate file ${certFile}`)

  const certificates = {
    key: fs.readFileSync(privateKeyFile),
    cert: fs.readFileSync(certFile)
  }

  const server = https.createServer(certificates, app.callback())
    .listen(port, host);

  console.log("Listening on https port " + port)
} else {

  const server = http.createServer(app.callback())
    .listen(port, host);

  console.log("Listening on port " + port)
}

