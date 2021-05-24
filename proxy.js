const path = require("path")
const Koa = require("koa")
const proxy = require("koa2-nginx")
const sendfile = require("koa-sendfile")
const route = require("koa-route")
const koastatic = require("koa-static")
const helmet = require("koa-helmet")

// config
const apiUrl = process.env.API_URL || "http://localhost:9090"
const port = process.env.PORT || 3000
const insecure = !!process.env.INSECURE || false
const staticDir = process.env.STATIC_DIR || path.join(__dirname, "build")

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

app.use(koastatic(staticDir))

app.use(
  proxy({
    "/api": {
      target: apiUrl,
      secure: !insecure,
      changeOrigin: true,
    },
    "/public": {
      target: apiUrl,
      secure: !insecure,
      changeOrigin: true,
      pathRewrite: {
        "^/public": "",
      },
    }
  })
)

app.use(route.get("/*", async function (ctx) {
  await sendfile(ctx, path.join(staticDir, "index.html"))
  if (!ctx.status) ctx.throw(404)
}))

app.listen(port, function () {
  console.log("Listening on port " + port)
})
