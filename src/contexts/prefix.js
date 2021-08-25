import { getCurrentUrl } from "preact-router"

class UrlManager {
  constructor() {
    let url = getCurrentUrl()
    //let url = window.location.origin + window.location.path;
    if (url.charAt(url.length-1) == "/"){
      url = url.substr(0, url.length -1);
    }

    this.baseUrl = url
  }
  buildUrl (url) {
      return this.baseUrl + url;
  }
}

export default new UrlManager()
