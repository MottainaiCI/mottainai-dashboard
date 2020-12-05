import axios from "@/axios"

const CaptchaService = {
  fetchCode() {
    return axios.get("/v1/client/captcha/new").then(({ data }) => data.code)
  },
}

export default CaptchaService
