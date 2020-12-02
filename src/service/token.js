import axios from "@/axios"

const TokenService = {
  fetchTokens() {
    return axios.get("/token").then(({ data }) => data)
  },
  create() {
    return axios.get(`/token/create`).then(({ data }) => data)
  },
  delete(id) {
    return axios.get(`/token/delete/${id}`)
  },
}

export default TokenService
