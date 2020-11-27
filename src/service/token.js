import axios from "@/axios"

const TokenService = {
  fetchTokens() {
    return axios.get("/token").then(({ data }) => data)
  },
}

export default TokenService
