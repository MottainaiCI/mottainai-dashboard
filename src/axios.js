import axios from "axios"
import UrlManager from "@/contexts/prefix"

const instance = axios.create({
  baseURL: `${UrlManager.buildUrl('/api/')}`,
})

instance.interceptors.request.use((config) => {
  const csrf = localStorage.getItem("mottainai:csrf")
  if (csrf) {
    config.headers = {
      "X-CSRFToken": csrf,
    }
  }
  return config
}, Promise.reject)

instance.interceptors.response.use((response) => {
  localStorage.setItem("mottainai:csrf", response.headers["x-csrftoken"])
  return response
})

export default instance
