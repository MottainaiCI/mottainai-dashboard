import path from "path"

const appPrefix = process.env.APP_PREFIX || "/"
const insecure = !!process.env.INSECURE || false
const apiUrl = process.env.API_URL || "http://localhost:9090"

export default {
  plugins: ["preact-cli-tailwind"],
  /**
   * Function that mutates the original webpack config.
   * Supports asynchronous changes when a promise is returned (or it's an async function).
   *
   * @param {object} config - original webpack config.
   * @param {object} env - options passed to the CLI.
   * @param {WebpackConfigHelpers} helpers - object with useful helpers for working with the webpack config.
   * @param {object} options - this is mainly relevant for plugins (will always be empty in the config), default to an empty object
   **/
  webpack(config, env, helpers, options) {
    config.devtool = false
    config.resolve = config.resolve || { alias: {} }
    config.resolve.alias["@"] = path.join(__dirname, "./src")
    config.output.publicPath = appPrefix

    if (config.devServer) {
      config.devServer["publicPath"] = appPrefix
      config.devServer["proxy"] = [
        {
          path: [appPrefix+"api", appPrefix+"public/"],
          target: apiUrl,
          secure: !insecure,
          pathRewrite: {
            ["^"+appPrefix+"api"]: "/api" ,
            ["^"+appPrefix+"public"]: "",
            [appPrefix]: "",
          },
        },
      ]
    }

    console.log(config)
    return config
  },
}
