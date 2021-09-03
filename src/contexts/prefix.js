import { getCurrentUrl } from "preact-router"

class UrlManager {
  constructor() {

    const validPaths = [
      "plans",
      "pipelines",
      "tasks",
      "artefacts",
      "nodes",
      "users",
      "tokens",
      "integrations",
    ]

    let url = getCurrentUrl()
    //let url = window.location.origin + window.location.path;
    if (url.charAt(url.length-1) == "/"){
      url = url.substr(0, url.length -1);
    } else {
      // Could be a path for tasks, etc.
      const words = url.split("/")
      if (words.length > 2) {
        if (validPaths.includes(words[words.length-1])) {
          // POST: we have on specifc menu section.
          // Example: /tasks
          words.splice(-1)
        } else if (validPaths.includes(words[words.length-2])) {
          // Example: tasks/ID
          words.splice(-2)
        }

        url = words.join('/')
      }

    }

    this.baseUrl = url
  }
  buildUrl (url) {
      return this.baseUrl + url;
  }
}

export default new UrlManager()
