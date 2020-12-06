import axios from "@/axios"

const UserService = {
  login(username, password, remember) {
    return new Promise((res, rej) => {
      axios
        .post("/v1/client/auth/login", { username, password, remember })
        .then(({ data }) => {
          localStorage.setItem("mottainai:auth", 1)
          res(data)
        }, rej)
    })
  },
  signup(email, username, password, passwordConfirm, captcha_id, captcha) {
    return axios.post("/v1/client/auth/register", {
      email,
      username,
      password,
      passwordConfirm,
      captcha_id,
      captcha,
    })
  },
  logout() {
    return new Promise((res, rej) => {
      axios.post("/v1/client/auth/logout").then(() => {
        localStorage.removeItem("mottainai:auth")
        res()
      }, rej)
    })
  },
  getUser() {
    return axios.get("/v1/client/auth/user").then(({ data }) => data)
  },
  clearUser() {
    localStorage.removeItem("mottainai:auth")
  },
  isLoggedIn() {
    return !!localStorage.getItem("mottainai:auth")
  },

  // user management
  getAllusers() {
    return axios.get("/user/list").then(({ data }) => data)
  },
  fetchUser(id) {
    return axios.get(`/user/show/${id}`).then(({ data }) => data)
  },
}

export default UserService
