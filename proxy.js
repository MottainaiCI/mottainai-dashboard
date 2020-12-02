const path = require("path")
const express = require("express")
const proxy = require("http-proxy-middleware")

// config
const apiUrl = process.env.API_URL || "http://localhost:9090"
const port = process.env.PORT || 3000

process.on("SIGINT", () => {
  console.info("Exiting server")
  process.exit(0)
})

const app = express()

app.use(express.static(path.join(__dirname, "build")))

app.use(
  "/api",
  proxy.createProxyMiddleware({
    target: apiUrl,
    changeOrigin: true,
  })
)
app.use(
  "/public",
  proxy.createProxyMiddleware({
    target: apiUrl,
    changeOrigin: true,
    pathRewrite: {
      "^/public": "",
    },
  })
)

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"))
})

app.listen(port, function () {
  console.log("Listening on port " + port)
})
