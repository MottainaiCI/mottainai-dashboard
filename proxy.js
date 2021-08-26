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
const useSSL = !!process.env.USE_SSL || false
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
        scriptSrcAttr: ["'self'", "'unsafe-inline'"],
        scriptSrcElem: ["'self'", "cdn.jsdelivr.net"],
        workerSrc: ["blob:"],
      },
    }
  })
)


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

console.log("Using prefix " + appPrefix + "\n" + useSSL);
const mRouter = new Router({
  prefix: appPrefix,
});

app.use( mount(appPrefix, koastatic(staticDir)) )

mRouter.get("/", async function (ctx) {
  await sendfile(ctx, path.join(staticDir, "index.html"));
  if (!ctx.status) ctx.throw(404)
});
app.use(mRouter.routes());
app.use(mRouter.allowedMethods());

app.use(logger())

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

