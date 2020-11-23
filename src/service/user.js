import axios from "@/axios"

const UserService = {
  login(username, password) {
    return new Promise((res, rej) => {
      axios
        .post("/v1/client/auth/login", { username, password })
        .then(({ data }) => {
          localStorage.setItem("mottainai:auth", 1)
          res(data)
        }, rej)
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
}

export default UserService
